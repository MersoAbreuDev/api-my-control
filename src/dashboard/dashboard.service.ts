import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Transaction, TransactionType, TransactionStatus } from '../entities/transaction.entity';
import { DashboardResponseDto, CategoryMonthlyDataDto, WorkIncomeMonthlyDto, WorkTransactionDto } from './dto/dashboard-response.dto';

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
    const transactionsPaid = await this.transactionRepository.find({
      where: {
        status: TransactionStatus.PAID,
        dueDate: Between(startDate, endDate),
      },
    });

    // Busca transações em aberto do mês
    const transactionsOpen = await this.transactionRepository.find({
      where: {
        status: TransactionStatus.OPEN,
        dueDate: Between(startDate, endDate),
      },
    });

    // Calcula totais de transações pagas
    const receitas = transactionsPaid
      .filter((t) => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);

    const despesas = transactionsPaid
      .filter((t) => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);

    const saldo = receitas - despesas;

    // Calcula despesas em aberto
    const despesasEmAberto = transactionsOpen
      .filter((t) => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);

    // Calcula receitas em aberto (a receber)
    const receitasEmAberto = transactionsOpen
      .filter((t) => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);

    // Calcula previsão de saldo futuro
    // Saldo futuro = (receitas pagas + receitas em aberto) - (despesas pagas + despesas em aberto)
    const saldoFuturo = (receitas + receitasEmAberto) - (despesas + despesasEmAberto);

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
      despesasEmAberto,
      receitasEmAberto,
      saldoFuturo,
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
   * Retorna a renda do mês específico pela categoria "Trabalho" com descrição e detalhes
   * Útil para dashboard com transações detalhadas
   */
  async getWorkIncomeByMonth(month?: number, year?: number): Promise<WorkIncomeMonthlyDto> {
    const now = new Date();
    const targetMonth = month ?? now.getMonth() + 1;
    const targetYear = year ?? now.getFullYear();

    // Validação do mês
    if (targetMonth < 1 || targetMonth > 12) {
      throw new Error('Mês inválido. Deve ser entre 1 e 12.');
    }

    // Busca receitas pagas da categoria "Trabalho" do mês específico
    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

    const transactions = await this.transactionRepository.find({
      where: {
        type: TransactionType.INCOME,
        category: 'Trabalho',
        status: TransactionStatus.PAID,
        dueDate: Between(startDate, endDate),
      },
      order: {
        dueDate: 'ASC',
      },
    });

    // Busca todas as transações do mês para calcular totais
    const allTransactions = await this.transactionRepository.find({
      where: {
        dueDate: Between(startDate, endDate),
      },
    });

    // Calcula totais
    const totalValue = transactions.reduce((sum, t) => sum + t.amount, 0);
    
    const despesasPagas = allTransactions
      .filter((t) => t.type === TransactionType.EXPENSE && t.status === TransactionStatus.PAID)
      .reduce((sum, t) => sum + t.amount, 0);

    const receitasPagas = allTransactions
      .filter((t) => t.type === TransactionType.INCOME && t.status === TransactionStatus.PAID)
      .reduce((sum, t) => sum + t.amount, 0);

    const despesasEmAberto = allTransactions
      .filter((t) => t.type === TransactionType.EXPENSE && t.status === TransactionStatus.OPEN)
      .reduce((sum, t) => sum + t.amount, 0);

    const receitasEmAberto = allTransactions
      .filter((t) => t.type === TransactionType.INCOME && t.status === TransactionStatus.OPEN)
      .reduce((sum, t) => sum + t.amount, 0);

    // Converte transações para DTO
    const transactionDtos: WorkTransactionDto[] = transactions.map((t) => ({
      id: t.id,
      description: t.description,
      category: t.category,
      amount: t.amount,
      dueDate: t.dueDate.toISOString(),
    }));

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

    return {
      month: `${monthNames[targetMonth - 1]} ${targetYear}`,
      monthNumber: targetMonth,
      year: targetYear,
      totalValue,
      despesasPagas,
      receitasPagas,
      despesasEmAberto,
      receitasEmAberto,
      transactions: transactionDtos,
    };
  }
}

