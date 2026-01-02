import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

/**
 * Estratégia JWT para autenticação
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private authService: AuthService,
    private configService: ConfigService
  ) {
    const secret = configService.get<string>('JWT_SECRET') || 'myControl-secret-key-change-in-production';
    
    // Função customizada para extrair o token
    // Usamos console.log temporariamente porque não podemos acessar this.logger antes de super()
    const extractToken = (req: any) => {
      console.log(`🔍 [JWT Strategy] Extraindo token da requisição...`);
      console.log(`📋 [JWT Strategy] Headers disponíveis: ${Object.keys(req.headers || {}).join(', ')}`);
      
      const authHeader = req.headers?.authorization || req.headers?.Authorization;
      console.log(`📋 [JWT Strategy] Authorization header encontrado: ${authHeader ? 'SIM' : 'NÃO'}`);
      
      if (authHeader) {
        console.log(`📋 [JWT Strategy] Tipo do header: ${typeof authHeader}`);
        console.log(`📋 [JWT Strategy] Conteúdo (primeiros 50 chars): ${authHeader.substring(0, 50)}`);
      }
      
      if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        console.log(`✅ [JWT Strategy] Token extraído com sucesso: ${token.substring(0, 30)}...`);
        return token;
      }
      
      console.error('❌ [JWT Strategy] Token não encontrado ou formato inválido no header Authorization');
      console.error(`📋 [JWT Strategy] Header recebido: ${authHeader}`);
      console.error(`📋 [JWT Strategy] Começa com "Bearer "? ${authHeader?.startsWith('Bearer ')}`);
      return null;
    };
    
    super({
      jwtFromRequest: extractToken,
      ignoreExpiration: false,
      secretOrKey: secret,
    });
    this.logger.log(`🔑 JWT Strategy inicializada com secret: ${secret.substring(0, 10)}...`);
  }

  async validate(payload: any, info?: any) {
    this.logger.log(`🔍 Validando payload JWT...`);
    this.logger.log(`📋 Payload recebido: ${JSON.stringify(payload)}`);
    
    if (!payload) {
      this.logger.error('❌ Payload vazio');
      this.logger.error(`📋 Info adicional: ${JSON.stringify(info)}`);
      throw new UnauthorizedException('Token inválido');
    }
    
    if (!payload.sub) {
      this.logger.error('❌ Payload sem sub (user ID)');
      this.logger.error(`📋 Payload completo: ${JSON.stringify(payload)}`);
      throw new UnauthorizedException('Token inválido - falta user ID');
    }
    
    this.logger.log(`✅ Token válido para usuário ID: ${payload.sub}, Email: ${payload.email}`);
    return { userId: payload.sub, email: payload.email };
  }
}

