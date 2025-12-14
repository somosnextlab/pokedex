import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api/v2")

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    
      //Forma facil de validar los dtos. 
      // Esto sirve para los quert parameters en las URL, transforma de stringa number o tipo de dato requerido
      transform: true,
      transformOptions:{
        enableImplicitConversion: true
      }
    })
  );

  await app.listen(process.env.PORT);
  console.log(`App running on port ${process.env.PORT}`)
}
bootstrap();
