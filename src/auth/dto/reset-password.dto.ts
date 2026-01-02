import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * DTO para requisição de recuperação de senha
 */
export class ResetPasswordDto {
  @ApiProperty({
    description: 'Email do usuário para recuperação de senha',
    example: 'mersoabreu@gmail.com',
    type: String,
  })
  @IsEmail({}, { message: 'Email deve ser um endereço válido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;
}

