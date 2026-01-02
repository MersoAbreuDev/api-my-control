import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * DTO para requisição de login
 */
export class LoginDto {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'mersoabreu@gmail.com',
    type: String,
  })
  @IsEmail({}, { message: 'Email deve ser um endereço válido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: '123456',
    type: String,
    minLength: 6,
  })
  @IsString({ message: 'Senha deve ser uma string' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  password: string;
}

