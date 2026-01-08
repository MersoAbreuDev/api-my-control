import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

/**
 * Controller de transações
 * Gerencia CRUD de transações financeiras
 */
@ApiTags('transactions')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  /**
   * Cria uma nova transação
   */
  @Post()
  @ApiOperation({
    summary: 'Criar nova transação',
    description: 'Cria uma nova transação financeira (receita ou despesa)',
  })
  @ApiResponse({
    status: 201,
    description: 'Transação criada com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autenticado',
  })
  create(
    @CurrentUser() user: any,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return this.transactionsService.create(user.userId, createTransactionDto);
  }

  /**
   * Lista todas as transações (todos os usuários podem ver todas)
   */
  @Get()
  @ApiOperation({
    summary: 'Listar transações',
    description: 'Retorna todas as transações do sistema. Todos os usuários autenticados podem ver todas as transações. O campo userId indica apenas quem criou a transação. Pode ser filtrado por type, status, month, year e category. Quando um filtro é aplicado, apenas as transações que correspondem aos critérios são retornadas.',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Filtrar por tipo (income ou expense)',
    enum: ['income', 'expense'],
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filtrar por status (open ou paid)',
    enum: ['open', 'paid'],
  })
  @ApiQuery({
    name: 'month',
    required: false,
    description: 'Filtrar por mês (1-12) baseado na data de vencimento',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'year',
    required: false,
    description: 'Filtrar por ano baseado na data de vencimento',
    type: Number,
    example: 2026,
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Filtrar por categoria. Exemplos: Food, Combustivel, Beleza, Bebidas, Alimentação, Transporte, etc.',
    type: String,
    example: 'Food',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de transações retornada com sucesso',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autenticado',
  })
  findAll(
    @CurrentUser() user: any,
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('month') month?: number,
    @Query('year') year?: number,
    @Query('category') category?: string,
  ) {
    // userId não é mais usado para filtrar, apenas para rastreamento
    // Log para debug - remover em produção
    console.log('[DEBUG Controller] Parâmetros recebidos:', {
      type,
      status,
      month,
      year,
      category,
      categoryType: typeof category,
      categoryLength: category?.length,
    });
    
    // Decodifica a categoria se vier codificada na URL
    const decodedCategory = category ? decodeURIComponent(category) : undefined;
    
    return this.transactionsService.findAll(type, status, month, year, decodedCategory);
  }

  /**
   * Busca uma transação específica
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Buscar transação por ID',
    description: 'Retorna os detalhes de uma transação específica',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da transação',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Transação encontrada',
  })
  @ApiResponse({
    status: 404,
    description: 'Transação não encontrada',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autenticado',
  })
  findOne(@CurrentUser() user: any, @Param('id', ParseIntPipe) id: number) {
    // Todos os usuários autenticados podem ver qualquer transação
    return this.transactionsService.findOne(id);
  }

  /**
   * Atualiza uma transação
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar transação',
    description: 'Atualiza os dados de uma transação existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da transação',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Transação atualizada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Transação não encontrada',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autenticado',
  })
  update(
    @CurrentUser() user: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(id, user.userId, updateTransactionDto);
  }

  /**
   * Remove uma transação
   */
  @Delete(':id')
  @ApiOperation({
    summary: 'Excluir transação',
    description: 'Remove uma transação do sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da transação',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Transação excluída com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Transação não encontrada',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autenticado',
  })
  remove(@CurrentUser() user: any, @Param('id', ParseIntPipe) id: number) {
    // Todos os usuários autenticados podem remover qualquer transação
    this.transactionsService.remove(id);
    return { message: 'Transação excluída com sucesso' };
  }

  /**
   * Marca transação como paga
   */
  @Patch(':id/mark-as-paid')
  @ApiOperation({
    summary: 'Marcar transação como paga',
    description: 'Marca uma transação aberta como paga',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da transação',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Transação marcada como paga',
  })
  @ApiResponse({
    status: 404,
    description: 'Transação não encontrada',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autenticado',
  })
  markAsPaid(@CurrentUser() user: any, @Param('id', ParseIntPipe) id: number) {
    return this.transactionsService.markAsPaid(id, user.userId);
  }
}

