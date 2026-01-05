import { Controller, Get, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { DashboardResponseDto, WorkIncomeMonthlyDto } from './dto/dashboard-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

/**
 * Controller de dashboard
 * Retorna resumos financeiros
 */
@ApiTags('dashboard')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /**
   * Retorna resumo financeiro do mês
   * Mostra resumo de todas as transações (todos os usuários)
   */
  @Get('summary')
  @ApiOperation({
    summary: 'Resumo financeiro',
    description: 'Retorna o resumo financeiro (receitas, despesas e saldo) do mês especificado. Inclui todas as transações de todos os usuários.',
  })
  @ApiQuery({
    name: 'month',
    required: false,
    description: 'Mês (1-12). Se não informado, usa o mês atual',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'year',
    required: false,
    description: 'Ano (ex: 2026). Se não informado, usa o ano atual',
    type: Number,
    example: 2026,
  })
  @ApiResponse({
    status: 200,
    description: 'Resumo financeiro retornado com sucesso',
    type: DashboardResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autenticado',
  })
  async getSummary(
    @CurrentUser() user: any,
    @Query('month') month?: number,
    @Query('year') year?: number,
  ): Promise<DashboardResponseDto> {
    // userId não é mais usado para filtrar, apenas para rastreamento
    return this.dashboardService.getSummary(
      month ? parseInt(month.toString()) : undefined,
      year ? parseInt(year.toString()) : undefined,
    );
  }

  /**
   * Retorna a renda do mês específico pela categoria "Trabalho" com descrição e detalhes
   * Útil para dashboard com transações detalhadas
   */
  @Get('work-income')
  @ApiOperation({
    summary: 'Renda de trabalho do mês específico com detalhes',
    description: 'Retorna todas as receitas pagas da categoria "Trabalho" do mês e ano especificados, incluindo descrição, categoria e valores individuais. Útil para dashboard detalhado.',
  })
  @ApiQuery({
    name: 'month',
    required: false,
    description: 'Mês (1-12). Se não informado, usa o mês atual',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'year',
    required: false,
    description: 'Ano (ex: 2026). Se não informado, usa o ano atual',
    type: Number,
    example: 2026,
  })
  @ApiResponse({
    status: 200,
    description: 'Dados de renda de trabalho retornados com sucesso',
    type: WorkIncomeMonthlyDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autenticado',
  })
  async getWorkIncomeByMonth(
    @CurrentUser() user: any,
    @Query('month') month?: number,
    @Query('year') year?: number,
  ): Promise<WorkIncomeMonthlyDto> {
    return this.dashboardService.getWorkIncomeByMonth(
      month ? parseInt(month.toString()) : undefined,
      year ? parseInt(year.toString()) : undefined,
    );
  }
}

