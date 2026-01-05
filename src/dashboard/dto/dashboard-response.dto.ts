import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para dados por categoria e mês
 */
export class CategoryMonthlyDataDto {
  @ApiProperty({
    description: 'Categoria',
    example: 'Alimentação',
    type: String,
  })
  category: string;

  @ApiProperty({
    description: 'Dados mês a mês',
    example: [
      { month: 'Jan 2026', value: 50000 },
      { month: 'Fev 2026', value: 45000 },
    ],
    type: Array,
  })
  monthlyData: Array<{
    month: string;
    value: number;
  }>;
}

/**
 * DTO de resposta do dashboard
 */
export class DashboardResponseDto {
  @ApiProperty({
    description: 'Total de receitas no período',
    example: 500000,
    type: Number,
  })
  receitas: number;

  @ApiProperty({
    description: 'Total de despesas no período',
    example: 195000,
    type: Number,
  })
  despesas: number;

  @ApiProperty({
    description: 'Saldo (receitas - despesas)',
    example: 305000,
    type: Number,
  })
  saldo: number;

  @ApiProperty({
    description: 'Total de despesas em aberto no período',
    example: 50000,
    type: Number,
  })
  despesasEmAberto: number;

  @ApiProperty({
    description: 'Mês de referência',
    example: 'Jan 2026',
    type: String,
  })
  month: string;

  @ApiProperty({
    description: 'Ano de referência',
    example: 2026,
    type: Number,
  })
  year: number;

  @ApiProperty({
    description: 'Soma de valores por categoria, mês a mês (apenas contas pagas)',
    example: [
      {
        category: 'Alimentação',
        monthlyData: [
          { month: 'Jan 2026', value: 50000 },
          { month: 'Fev 2026', value: 45000 },
        ],
      },
      {
        category: 'Transporte',
        monthlyData: [
          { month: 'Jan 2026', value: 30000 },
          { month: 'Fev 2026', value: 32000 },
        ],
      },
    ],
    type: [CategoryMonthlyDataDto],
  })
  categoriesByMonth: CategoryMonthlyDataDto[];
}

/**
 * DTO para transação de trabalho
 */
export class WorkTransactionDto {
  @ApiProperty({
    description: 'ID da transação',
    example: 1,
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: 'Descrição da transação',
    example: 'Salário Janeiro',
    type: String,
  })
  description: string;

  @ApiProperty({
    description: 'Categoria da transação',
    example: 'Trabalho',
    type: String,
  })
  category: string;

  @ApiProperty({
    description: 'Valor da transação (em centavos)',
    example: 500000,
    type: Number,
  })
  amount: number;

  @ApiProperty({
    description: 'Data de vencimento',
    example: '2026-01-15T00:00:00.000Z',
    type: String,
  })
  dueDate: string;
}

/**
 * DTO para maior renda mês a mês (categoria Trabalho)
 */
export class WorkIncomeMonthlyDto {
  @ApiProperty({
    description: 'Mês formatado',
    example: 'Jan 2026',
    type: String,
  })
  month: string;

  @ApiProperty({
    description: 'Número do mês (1-12)',
    example: 1,
    type: Number,
  })
  monthNumber: number;

  @ApiProperty({
    description: 'Ano',
    example: 2026,
    type: Number,
  })
  year: number;

  @ApiProperty({
    description: 'Valor total da renda de trabalho no mês (em centavos)',
    example: 500000,
    type: Number,
  })
  totalValue: number;

  @ApiProperty({
    description: 'Total de despesas pagas no mês (em centavos)',
    example: 195000,
    type: Number,
  })
  despesasPagas: number;

  @ApiProperty({
    description: 'Total de receitas pagas no mês (em centavos)',
    example: 500000,
    type: Number,
  })
  receitasPagas: number;

  @ApiProperty({
    description: 'Total de despesas em aberto no mês (em centavos)',
    example: 50000,
    type: Number,
  })
  despesasEmAberto: number;

  @ApiProperty({
    description: 'Total de receitas em aberto no mês (em centavos)',
    example: 100000,
    type: Number,
  })
  receitasEmAberto: number;

  @ApiProperty({
    description: 'Transações de trabalho do mês',
    type: [WorkTransactionDto],
  })
  transactions: WorkTransactionDto[];
}

