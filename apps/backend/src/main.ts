import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração de CORS para permitir comunicação com o frontend
  app.enableCors({
    origin: [
      'http://localhost:3000', // Frontend Next.js (desenvolvimento)
      'https://app-pais.ucdb.br', // Frontend em produção
    ],
    credentials: true,
  });

  // Configuração de validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Configuração do Swagger/OpenAPI
  const config = new DocumentBuilder()
    .setTitle('Festa Julina API')
    .setDescription('API para sistema de festa julina')
    .setVersion('1.0')
    .addTag('festa-julina')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`🚀 Backend rodando na porta ${port}`);
  console.log(
    `📚 Documentação disponível em http://localhost:${port}/api/docs`,
  );
}

void bootstrap();
