import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { Public } from './decorators/public.decorator';

/**
 * Controller de autenticação
 * Gerencia login e recuperação de senha
 */
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Endpoint de login
   * Autentica o usuário e retorna um token JWT
   */
  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login do usuário',
    description: 'Autentica o usuário com email e senha, retornando um token JWT',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas',
    schema: {
      example: {
        statusCode: 401,
        message: 'Email ou senha incorretos',
        error: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    try {
      return await this.authService.login(loginDto.email, loginDto.password);
    } catch (error) {
      throw new HttpException(
        error.message || 'Erro ao fazer login',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Endpoint de recuperação de senha
   * Envia email com instruções para recuperação
   */
  @Post('forgot-password')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Recuperação de senha',
    description: 'Envia email com instruções para recuperação de senha',
  })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Email de recuperação enviado com sucesso',
    schema: {
      example: {
        message: 'Email de recuperação enviado! Verifique sua caixa de entrada.',
        success: true,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Email não encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Email não encontrado',
        error: 'Not Found',
      },
    },
  })
  async forgotPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    try {
      const result = await this.authService.resetPassword(
        resetPasswordDto.email,
      );
      return {
        message: 'Email de recuperação enviado! Verifique sua caixa de entrada.',
        success: result,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Erro ao enviar email de recuperação',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

