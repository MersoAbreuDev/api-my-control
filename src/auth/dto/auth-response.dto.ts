import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO de resposta de autenticação
 */
export class AuthResponseDto {
  @ApiProperty({
    description: 'Token JWT para autenticação',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    type: String,
  })
  access_token: string;

  @ApiProperty({
    description: 'Tipo do token',
    example: 'Bearer',
    type: String,
  })
  token_type: string;

  @ApiProperty({
    description: 'Dados do usuário autenticado',
    type: Object,
    example: {
      id: 1,
      email: 'mersoabreu@gmail.com',
      name: 'Emerson Abreu',
    },
  })
  user: {
    id: number;
    email: string;
    name: string;
  };
}

