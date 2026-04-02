import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Food Platform API')
    .setDescription('Tài liệu API cho Food Platform')
    .setVersion('2.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    customCssUrl: 'https://unpkg.com/swagger-ui-themes@3.0.0/themes/3.x/theme-material.css',
    customSiteTitle: 'Food Platform API ',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
