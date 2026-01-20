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
    'http://api-jhukyy-dcf077-168-231-92-86.traefik.me',
    'https://api-jhukyy-dcf077-168-231-92-86.traefik.me', // Adiciona HTTPS
  ];
  
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? [...defaultOrigins, ...process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())]
    : defaultOrigins;

  console.log('🌐 CORS - Origens permitidas:', allowedOrigins);

  app.enableCors({
    origin: (origin, callback) => {
      // Log para debug
      console.log(`🔍 CORS - Requisição recebida de origem: ${origin || 'sem origem (mobile/Postman)'}`);
      
      // Permite requisições sem origin (mobile apps, Postman, etc.)
      if (!origin) {
        console.log('✅ CORS permitido: requisição sem origin');
        return callback(null, true);
      }
      
      // Permite origens na lista (HTTP e HTTPS)
      if (allowedOrigins.includes(origin)) {
        console.log(`✅ CORS permitido: origem na lista - ${origin}`);
        return callback(null, true);
      }
      
      // Permite versão HTTP/HTTPS da mesma origem
      const httpVersion = origin.replace('https://', 'http://');
      const httpsVersion = origin.replace('http://', 'https://');
      if (allowedOrigins.includes(httpVersion) || allowedOrigins.includes(httpsVersion)) {
        console.log(`✅ CORS permitido: versão alternativa da origem - ${origin}`);
        return callback(null, true);
      }
      
      // Permite todos os subdomínios do Vercel (*.vercel.app)
      if (origin.endsWith('.vercel.app')) {
        console.log(`✅ CORS permitido para subdomínio Vercel: ${origin}`);
        return callback(null, true);
      }
      
      // Permite qualquer origem em desenvolvimento (NODE_ENV !== 'production')
      if (process.env.NODE_ENV !== 'production') {
        console.log(`✅ CORS permitido (desenvolvimento) para: ${origin}`);
        return callback(null, true);
      }
      
      // Em produção, bloqueia origens não autorizadas
      // Para permitir uma nova origem, adicione em defaultOrigins ou via ALLOWED_ORIGINS
      console.warn(`⚠️ CORS bloqueado para origem: ${origin}`);
      console.warn(`💡 Dica: Adicione esta origem em defaultOrigins ou configure ALLOWED_ORIGINS`);
      callback(new Error('Not allowed by CORS'));
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
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
