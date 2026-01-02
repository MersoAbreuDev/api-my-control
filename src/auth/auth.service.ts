import { Injectable, UnauthorizedException, NotFoundException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

/**
 * Serviço de autenticação
 * Gerencia lógica de login, JWT e recuperação de senha
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    // Cria usuário padrão se não existir
    this.createDefaultUser();
  }

  /**
   * Cria usuário padrão se não existir
   */
  private async createDefaultUser() {
    const existingUser = await this.userRepository.findOne({
      where: { email: 'mersoabreu@gmail.com' },
    });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('123456', 10);
      const user = this.userRepository.create({
        email: 'mersoabreu@gmail.com',
        password: hashedPassword,
        name: 'Emerson Abreu',
      });
      await this.userRepository.save(user);
    }
  }

  /**
   * Valida credenciais do usuário
   */
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    const { password: _, ...result } = user;
    return result;
  }

  /**
   * Realiza login do usuário
   */
  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Email ou senha incorretos');
    }

    const payload = { email: user.email, sub: user.id };
    this.logger.log(`🔑 Gerando token JWT para usuário ID: ${user.id}, Email: ${user.email}`);
    this.logger.log(`📋 Payload do token: ${JSON.stringify(payload)}`);
    const access_token = this.jwtService.sign(payload);
    this.logger.log(`✅ Token gerado com sucesso: ${access_token.substring(0, 50)}...`);

    return {
      access_token,
      token_type: 'Bearer',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  /**
   * Envia email de recuperação de senha
   */
  async resetPassword(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('Email não encontrado');
    }

    // Em produção, aqui enviaria um email real
    // Por enquanto, apenas retorna true
    console.log(`Email de recuperação enviado para: ${email}`);
    return true;
  }

  /**
   * Valida token JWT
   */
  async validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      return null;
    }
  }
}

