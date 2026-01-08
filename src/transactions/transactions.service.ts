import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionType, TransactionStatus } from '../entities/transaction.entity';
import { CreateTransactionDto, TransactionStatus as DtoTransactionStatus } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

/**
 * Serviço de transações
 * Gerencia CRUD de transações financeiras
 */
@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  /**
   * Cria uma nova transação
   */
  async create(userId: number, createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const transaction = this.transactionRepository.create({
      userId,
      description: createTransactionDto.description,
      amount: createTransactionDto.amount,
      category: createTransactionDto.category,
      type: createTransactionDto.type as TransactionType,
      status: TransactionStatus.OPEN,
      dueDate: new Date(createTransactionDto.dueDate),
      recurrence: createTransactionDto.recurrence,
      createdBy: userId, // Usuário que criou
      updatedBy: userId, // Na criação, também é o mesmo usuário
    });

    return this.transactionRepository.save(transaction);
  }

  /**
   * Busca todas as transações (todos os usuários podem ver todas)
   * userId é usado apenas para rastrear quem criou, não para filtrar
   */
  async findAll(
    type?: string,
    status?: string,
    month?: number,
    year?: number,
    category?: string,
  ): Promise<Transaction[]> {
    console.log('[DEBUG Service] Parâmetros recebidos no findAll:', { type, status, month, year, category });
    
    const queryBuilder = this.transactionRepository
      .createQueryBuilder('transaction')
      .orderBy('transaction.dueDate', 'DESC');

    // Filtrar por categoria - PRIORITÁRIO - aplicar primeiro
    if (category && category.trim() !== '') {
      const normalizedCategory = category.trim();
      queryBuilder.andWhere('transaction.category = :category', { category: normalizedCategory });
      console.log(`[DEBUG Service] Aplicando filtro por categoria: "${normalizedCategory}"`);
    }

    // Aplicar filtros de tipo e status
    if (type && type.trim() !== '') {
      queryBuilder.andWhere('transaction.type = :type', { type: type.trim() });
    }

    if (status && status.trim() !== '') {
      queryBuilder.andWhere('transaction.status = :status', { status: status.trim() });
    }

    // Filtrar por mês e ano baseado na data de vencimento (dueDate)
    if (month && year) {
      // Cria o primeiro e último dia do mês/ano no formato YYYY-MM-DD
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
      // Último dia do mês
      const lastDay = new Date(year, month, 0).getDate();
      const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
      
      queryBuilder.andWhere('DATE(transaction.dueDate) >= :startDate', { startDate });
      queryBuilder.andWhere('DATE(transaction.dueDate) <= :endDate', { endDate });
    } else if (month) {
      // Se só tiver mês, usa o ano atual
      const currentYear = new Date().getFullYear();
      const startDate = `${currentYear}-${String(month).padStart(2, '0')}-01`;
      const lastDay = new Date(currentYear, month, 0).getDate();
      const endDate = `${currentYear}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
      
      queryBuilder.andWhere('DATE(transaction.dueDate) >= :startDate', { startDate });
      queryBuilder.andWhere('DATE(transaction.dueDate) <= :endDate', { endDate });
    } else if (year) {
      // Se só tiver ano, filtra todo o ano
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;
      
      queryBuilder.andWhere('DATE(transaction.dueDate) >= :startDate', { startDate });
      queryBuilder.andWhere('DATE(transaction.dueDate) <= :endDate', { endDate });
    }

    const sql = queryBuilder.getSql();
    const parameters = queryBuilder.getParameters();
    console.log('[DEBUG Service] SQL Query gerada:', sql);
    console.log('[DEBUG Service] Parâmetros da query:', JSON.stringify(parameters, null, 2));
    
    const results = await queryBuilder.getMany();
    console.log(`[DEBUG Service] Total de transações retornadas: ${results.length}`);
    if (category && results.length > 0) {
      console.log(`[DEBUG Service] Primeira transação retornada - categoria: "${results[0].category}"`);
    }

    return results;
  }

  /**
   * Busca uma transação por ID
   * Todos os usuários autenticados podem ver qualquer transação
   */
  async findOne(id: number): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
    });

    if (!transaction) {
      throw new NotFoundException(`Transação com ID ${id} não encontrada`);
    }

    return transaction;
  }

  /**
   * Atualiza uma transação
   * Todos os usuários autenticados podem atualizar qualquer transação
   * userId é usado apenas para rastrear quem atualizou (updatedBy)
   */
  async update(
    id: number,
    userId: number,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<Transaction> {
    // Verifica se a transação existe
    const transaction = await this.findOne(id);

    if (updateTransactionDto.dueDate) {
      transaction.dueDate = new Date(updateTransactionDto.dueDate);
    }

    if (updateTransactionDto.status === DtoTransactionStatus.PAID) {
      transaction.status = TransactionStatus.PAID;
      transaction.paidDate = new Date();
    }

    if (updateTransactionDto.description) {
      transaction.description = updateTransactionDto.description;
    }

    if (updateTransactionDto.amount !== undefined) {
      transaction.amount = updateTransactionDto.amount;
    }

    if (updateTransactionDto.category) {
      transaction.category = updateTransactionDto.category;
    }

    if (updateTransactionDto.type) {
      transaction.type = updateTransactionDto.type as TransactionType;
    }

    if (updateTransactionDto.recurrence) {
      transaction.recurrence = updateTransactionDto.recurrence;
    }

    // Atualiza o usuário que modificou a transação
    transaction.updatedBy = userId;

    return this.transactionRepository.save(transaction);
  }

  /**
   * Remove uma transação
   * Todos os usuários autenticados podem remover qualquer transação
   */
  async remove(id: number): Promise<void> {
    // Verifica se a transação existe
    await this.findOne(id);

    await this.transactionRepository.delete(id);
  }

  /**
   * Marca transação como paga
   * Todos os usuários autenticados podem marcar qualquer transação como paga
   * userId é usado apenas para rastrear quem atualizou (updatedBy)
   */
  async markAsPaid(id: number, userId: number): Promise<Transaction> {
    // Verifica se a transação existe
    const transaction = await this.findOne(id);

    transaction.status = TransactionStatus.PAID;
    transaction.paidDate = new Date();
    transaction.updatedBy = userId; // Atualiza o usuário que modificou

    return this.transactionRepository.save(transaction);
  }
}

