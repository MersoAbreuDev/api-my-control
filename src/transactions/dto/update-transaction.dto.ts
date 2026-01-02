import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTransactionDto } from './create-transaction.dto';
import { IsOptional, IsEnum } from 'class-validator';
import { TransactionStatus } from './create-transaction.dto';

/**
 * DTO para atualização de transação
 */
export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {
  @ApiProperty({
    description: 'Status da transação',
    example: 'paid',
    enum: TransactionStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(TransactionStatus, { message: 'Status inválido' })
  status?: TransactionStatus;

  @ApiProperty({
    description: 'Data de pagamento (quando status for paid)',
    example: '2026-01-15',
    type: String,
    format: 'date',
    required: false,
  })
  @IsOptional()
  paidDate?: string;
}

