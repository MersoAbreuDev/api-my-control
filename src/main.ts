import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita CORS para o frontend
  const defaultOrigins = [
    'http://localhost:4200',
    'http://localhost:3000',
    'https://my-control-phi.vercel.app',
    'https://my-control-2bgdtqlwq-control-apps-projects-c58bc4ce.vercel.app',
    'http://api-jhukyy-dcf077-168-231-92-86.traefik.me',
    'https://api-jhukyy-dcf077-168-231-92-86.traefik.me',
  ];
  
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? [...defaultOrigins, ...process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())]
    : defaultOrigins;

  console.log('🌐 CORS - Origens permitidas:', allowedOrigins);

  app.enableCors({
    origin: (origin, callback) => {
      // Log detalhado para debug
      console.log(`\n🔍 [CORS] ==========================================`);
      console.log(`🔍 [CORS] Requisição recebida de origem: ${origin || 'sem origem (mobile/Postman)'}`);
      console.log(`🔍 [CORS] Origens permitidas:`, allowedOrigins);
      
      // Log adicional: se não tiver origin, pode ser requisição server-side ou proxy
      if (!origin) {
        console.log(`⚠️ [CORS] ATENÇÃO: Requisição sem header Origin`);
        console.log(`⚠️ [CORS] Isso pode acontecer se:`);
        console.log(`⚠️ [CORS] - É uma requisição server-side (SSR do Vercel)`);
        console.log(`⚠️ [CORS] - O proxy reverso (Traefik) removeu o header Origin`);
        console.log(`⚠️ [CORS] - É uma requisição direta (não do navegador)`);
      }
      
      // Permite requisições sem origin (mobile apps, Postman, etc.)
      if (!origin) {
        console.log('✅ [CORS] PERMITIDO: requisição sem origin');
        return callback(null, true);
      }
      
      // Remove protocolo e barra para comparação mais flexível
      const originClean = origin.replace(/^https?:\/\//, '').replace(/\/$/, '');
      const originWithProtocol = origin.startsWith('https') ? `https://${originClean}` : `http://${originClean}`;
      
      // Permite origens na lista (HTTP e HTTPS)
      if (allowedOrigins.includes(origin) || allowedOrigins.includes(originWithProtocol)) {
        console.log(`✅ [CORS] PERMITIDO: origem na lista - ${origin}`);
        return callback(null, true);
      }
      
      // Verifica versões com/sem protocolo e barra
      const httpVersion = origin.replace('https://', 'http://').replace(/\/$/, '');
      const httpsVersion = origin.replace('http://', 'https://').replace(/\/$/, '');
      if (allowedOrigins.includes(httpVersion) || allowedOrigins.includes(httpsVersion)) {
        console.log(`✅ [CORS] PERMITIDO: versão alternativa - ${origin}`);
        return callback(null, true);
      }
      
      // Permite todos os subdomínios do Vercel (*.vercel.app)
      const originWithoutSlash = origin.replace(/\/$/, '').replace(/^https?:\/\//, '');
      if (originWithoutSlash.endsWith('.vercel.app')) {
        console.log(`✅ [CORS] PERMITIDO: subdomínio Vercel - ${origin}`);
        return callback(null, true);
      }
      
      // Verifica se a origem sem protocolo/barra está na lista
      const originBase = origin.replace(/^https?:\/\//, '').replace(/\/$/, '');
      for (const allowed of allowedOrigins) {
        const allowedBase = allowed.replace(/^https?:\/\//, '').replace(/\/$/, '');
        if (originBase === allowedBase) {
          console.log(`✅ [CORS] PERMITIDO: origem corresponde (sem protocolo/barra) - ${origin}`);
          return callback(null, true);
        }
      }
      
      // Permite qualquer origem em desenvolvimento (NODE_ENV !== 'production')
      if (process.env.NODE_ENV !== 'production') {
        console.log(`✅ [CORS] PERMITIDO (desenvolvimento): ${origin}`);
        return callback(null, true);
      }
      
      // Em produção, permite temporariamente para debug (REMOVER EM PRODUÇÃO FINAL)
      console.warn(`\n⚠️ [CORS] ==========================================`);
      console.warn(`⚠️ [CORS] ORIGEM NÃO ESTÁ NA LISTA: ${origin}`);
      console.warn(`⚠️ [CORS] Origem limpa: ${originBase}`);
      console.warn(`⚠️ [CORS] Permitindo temporariamente para debug`);
      console.warn(`⚠️ [CORS] Adicione esta origem: ${origin}`);
      console.warn(`⚠️ [CORS] ==========================================\n`);
      return callback(null, true); // Temporariamente permissivo
      
      // Código para bloquear (descomente quando identificar todas as origens):
      // console.warn(`⚠️ CORS bloqueado para origem: ${origin}`);
      // callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Authorization'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Validação global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('MyControl API')
    .setDescription('API para controle financeiro pessoal - Gerencie suas receitas e despesas')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('auth', 'Endpoints de autenticação')
    .addTag('transactions', 'Endpoints de transações financeiras')
    .addTag('dashboard', 'Endpoints de dashboard e resumos')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 3000;
  // Escuta em 0.0.0.0 para aceitar conexões externas (não apenas localhost)
  await app.listen(port, '0.0.0.0');
  
  console.log('\n' + '='.repeat(60));
  console.log('🚀 APLICAÇÃO INICIADA COM SUCESSO!');
  console.log('='.repeat(60));
  console.log(`📍 Servidor rodando em: http://0.0.0.0:${port}`);
  console.log(`🌐 Acessível externamente na porta: ${port}`);
  console.log(`📚 Swagger documentation: http://0.0.0.0:${port}/api/docs`);
  console.log(`🔒 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS configurado para ${allowedOrigins.length} origem(ns)`);
  console.log('='.repeat(60) + '\n');
}

bootstrap();
