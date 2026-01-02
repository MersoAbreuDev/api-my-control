import { ApiProperty } from '@nestjs/swagger';

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
}

