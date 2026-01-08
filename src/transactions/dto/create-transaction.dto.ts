import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsDateString,
  Min,
} from 'class-validator';

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export enum TransactionStatus {
  OPEN = 'open',
  PAID = 'paid',
}

export enum RecurrenceType {
  UNIQUE = 'Única',
  MONTHLY = 'Mensal',
  WEEKLY = 'Semanal',
  YEARLY = 'Anual',
}

/**
 * DTO para criação de transação
 */
export class CreateTransactionDto {
  @ApiProperty({
    description: 'Descrição da transação',
    example: 'Aluguel',
    type: String,
  })
  @IsString({ message: 'Descrição deve ser uma string' })
  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  description: string;

  @ApiProperty({
    description: 'Valor da transação em centavos',
    example: 152000,
    type: Number,
    minimum: 0,
  })
  @IsNumber({}, { message: 'Valor deve ser um número' })
  @IsNotEmpty({ message: 'Valor é obrigatório' })
  @Min(0, { message: 'Valor deve ser maior ou igual a zero' })
  amount: number;

  @ApiProperty({
    description: 'Categoria da transação',
    example: 'Alimentação',
    type: String,
    enum: [
      'Alimentação',
      'Transporte',
      'Moradia',
      'Saúde',
      'Educação',
      'Lazer',
      'Trabalho',
      'Utilidades',
      'Outros',
      'Food',
      'Combustivel',
      'Beleza',
      'Bebidas',
    ],
  })
  @IsString({ message: 'Categoria deve ser uma string' })
  @IsNotEmpty({ message: 'Categoria é obrigatória' })
  category: string;

  @ApiProperty({
    description: 'Tipo da transação',
    example: 'expense',
    enum: TransactionType,
  })
  @IsEnum(TransactionType, { message: 'Tipo deve ser income ou expense' })
  @IsNotEmpty({ message: 'Tipo é obrigatório' })
  type: TransactionType;

  @ApiProperty({
    description: 'Data de vencimento',
    example: '2026-01-15',
    type: String,
    format: 'date',
  })
  @IsDateString({}, { message: 'Data de vencimento deve ser uma data válida' })
  @IsNotEmpty({ message: 'Data de vencimento é obrigatória' })
  dueDate: string;

  @ApiProperty({
    description: 'Recorrência da transação',
    example: 'Única',
    enum: RecurrenceType,
    default: RecurrenceType.UNIQUE,
  })
  @IsEnum(RecurrenceType, { message: 'Recorrência inválida' })
  recurrence: RecurrenceType;
}

