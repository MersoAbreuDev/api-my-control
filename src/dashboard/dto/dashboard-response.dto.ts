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

