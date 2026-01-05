import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Transaction, TransactionType, TransactionStatus } from '../entities/transaction.entity';
import { DashboardResponseDto, CategoryMonthlyDataDto, WorkIncomeMonthlyDto } from './dto/dashboard-response.dto';

/**
 * Serviço de dashboard
 * Calcula resumos financeiros
 */
@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  /**
   * Calcula resumo financeiro do mês
   * Mostra resumo de todas as transações (todos os usuários)
   * userId não é mais usado para filtrar, apenas para rastreamento
   */
  async getSummary(month?: number, year?: number): Promise<DashboardResponseDto> {
    const now = new Date();
    const targetMonth = month ?? now.getMonth() + 1;
    const targetYear = year ?? now.getFullYear();

    // Data inicial e final do mês
    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

    // Busca transações pagas do mês (todas as transações, não apenas do usuário)
    const transactions = await this.transactionRepository.find({
      where: {
        status: TransactionStatus.PAID,
        dueDate: Between(startDate, endDate),
      },
    });

    // Calcula totais
    const receitas = transactions
      .filter((t) => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);

    const despesas = transactions
      .filter((t) => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);

    const saldo = receitas - despesas;

    const monthNames = [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ];

    // Calcula dados por categoria mês a mês (apenas contas pagas)
    const categoriesByMonth = await this.getCategoriesByMonth(targetYear);

    return {
      receitas,
      despesas,
      saldo,
      month: `${monthNames[targetMonth - 1]} ${targetYear}`,
      year: targetYear,
      categoriesByMonth,
    };
  }

  /**
   * Calcula soma de valores por categoria, mês a mês (apenas contas pagas)
   */
  async getCategoriesByMonth(year: number): Promise<CategoryMonthlyDataDto[]> {
    // Busca todas as transações pagas do ano
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);

    const transactions = await this.transactionRepository.find({
      where: {
        status: TransactionStatus.PAID,
        dueDate: Between(startDate, endDate),
      },
    });

    // Agrupa por categoria
    const categoryMap = new Map<string, Map<number, number>>();

    transactions.forEach((transaction) => {
      const category = transaction.category;
      const month = new Date(transaction.dueDate).getMonth() + 1; // 1-12

      if (!categoryMap.has(category)) {
        categoryMap.set(category, new Map());
      }

      const monthMap = categoryMap.get(category)!;
      const currentValue = monthMap.get(month) || 0;
      monthMap.set(month, currentValue + transaction.amount);
    });

    // Converte para o formato de resposta
    const monthNames = [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ];

    const result: CategoryMonthlyDataDto[] = [];

    categoryMap.forEach((monthMap, category) => {
      const monthlyData: Array<{ month: string; value: number }> = [];
      
      // Para cada mês do ano (1-12)
      for (let month = 1; month <= 12; month++) {
        const value = monthMap.get(month) || 0;
        if (value > 0) {
          monthlyData.push({
            month: `${monthNames[month - 1]} ${year}`,
            value,
          });
        }
      }

      if (monthlyData.length > 0) {
        result.push({
          category,
          monthlyData,
        });
      }
    });

    // Ordena por categoria
    result.sort((a, b) => a.category.localeCompare(b.category));

    return result;
  }

  /**
   * Retorna a maior renda mês a mês pela categoria "Trabalho"
   * Útil para preencher gráficos de renda mensal
   */
  async getWorkIncomeByMonth(year?: number): Promise<WorkIncomeMonthlyDto[]> {
    const now = new Date();
    const targetYear = year ?? now.getFullYear();

    // Busca todas as receitas pagas da categoria "Trabalho" do ano
    const startDate = new Date(targetYear, 0, 1);
    const endDate = new Date(targetYear, 11, 31, 23, 59, 59);

    const transactions = await this.transactionRepository.find({
      where: {
        type: TransactionType.INCOME,
        category: 'Trabalho',
        status: TransactionStatus.PAID,
        dueDate: Between(startDate, endDate),
      },
    });

    // Agrupa por mês e soma os valores
    const monthMap = new Map<number, number>();

    transactions.forEach((transaction) => {
      const month = new Date(transaction.dueDate).getMonth() + 1; // 1-12
      const currentValue = monthMap.get(month) || 0;
      monthMap.set(month, currentValue + transaction.amount);
    });

    // Converte para o formato de resposta
    const monthNames = [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ];

    const result: WorkIncomeMonthlyDto[] = [];

    // Para cada mês do ano (1-12)
    for (let month = 1; month <= 12; month++) {
      const value = monthMap.get(month) || 0;
      result.push({
        month: `${monthNames[month - 1]} ${targetYear}`,
        value,
        monthNumber: month,
        year: targetYear,
      });
    }

    return result;
  }
}

