import { Injectable, ExecutionContext, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/**
 * Guard JWT para proteção de rotas
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    // Verifica tanto 'authorization' quanto 'Authorization' (case-insensitive)
    const authHeader = request.headers.authorization || request.headers.Authorization;
    
    this.logger.log(`🔍 Verificando autenticação para: ${request.url}`);
    this.logger.log(`📋 Authorization header: ${authHeader ? authHeader.substring(0, 50) + '...' : 'NÃO ENCONTRADO'}`);
    this.logger.log(`📋 Todos os headers:`, Object.keys(request.headers));
    this.logger.log(`📋 Headers completos:`, JSON.stringify(request.headers, null, 2));

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      this.logger.error(`❌ Autenticação falhou:`);
      this.logger.error(`   - Erro: ${err?.message || 'N/A'}`);
      this.logger.error(`   - Info: ${info?.message || 'N/A'}`);
      this.logger.error(`   - User: ${user ? 'Presente' : 'Ausente'}`);
      
      if (info?.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expirado');
      }
      if (info?.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Token inválido');
      }
      if (info?.name === 'NotBeforeError') {
        throw new UnauthorizedException('Token ainda não válido');
      }
      
      throw new UnauthorizedException(info?.message || 'Token inválido');
    }
    this.logger.log(`✅ Usuário autenticado: ${user.email} (ID: ${user.userId})`);
    return user;
  }
}

