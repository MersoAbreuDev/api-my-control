import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export enum TransactionStatus {
  OPEN = 'open',
  PAID = 'paid',
}

@Entity('transactions')
@Index(['userId'])
@Index(['userId', 'type'])
@Index(['userId', 'status'])
@Index(['dueDate'])
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.transactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  description: string;

  @Column({ type: 'int' })
  amount: number; // Valor em centavos

  @Column()
  category: string;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.OPEN })
  status: TransactionStatus;

  @Column({ type: 'datetime' })
  dueDate: Date;

  @Column({ type: 'datetime', nullable: true })
  paidDate: Date | null;

  @Column({ default: 'Única' })
  recurrence: string;

  @Column({ nullable: true })
  createdBy: number; // ID do usuário que criou a transação

  @Column({ nullable: true })
  updatedBy: number; // ID do usuário que atualizou a transação

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

