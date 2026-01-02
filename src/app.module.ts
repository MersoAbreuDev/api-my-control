import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TransactionsModule } from './transactions/transactions.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { User } from './entities/user.entity';
import { Transaction } from './entities/transaction.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbUrl = configService.get<string>('DATABASE_URL');
        // Parse MySQL URL: mysql://user:password@host:port/database
        const urlMatch = dbUrl?.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
        
        if (!urlMatch) {
          throw new Error('Invalid DATABASE_URL format');
        }

        const [, username, password, host, port, database] = urlMatch;

        return {
          type: 'mysql',
          host,
          port: parseInt(port, 10),
          username,
          password,
          database,
          entities: [User, Transaction],
          synchronize: true, // Cria/atualiza tabelas automaticamente
          logging: false,
          charset: 'utf8mb4',
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Transaction]),
    AuthModule,
    TransactionsModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
