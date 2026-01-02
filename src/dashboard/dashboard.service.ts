import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Transaction, TransactionType, TransactionStatus } from '../entities/transaction.entity';
import { DashboardResponseDto } from './dto/dashboard-response.dto';

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
   */
  async getSummary(userId: number, month?: number, year?: number): Promise<DashboardResponseDto> {
    const now = new Date();
    const targetMonth = month ?? now.getMonth() + 1;
    const targetYear = year ?? now.getFullYear();

    // Data inicial e final do mês
    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

    // Busca transações pagas do mês
    const transactions = await this.transactionRepository.find({
      where: {
        userId,
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

    return {
      receitas,
      despesas,
      saldo,
      month: `${monthNames[targetMonth - 1]} ${targetYear}`,
      year: targetYear,
    };
  }
}

