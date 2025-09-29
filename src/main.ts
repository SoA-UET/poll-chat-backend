import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MongoExceptionFilter } from './common/filters/mongo-exception.filter';
import { ConfigService } from '@nestjs/config';

function configureGlobalFilters(app: INestApplication<any>) {
  app.useGlobalFilters(
    new MongoExceptionFilter(),
  );
}

function configureCors(app: INestApplication<any>) {
  const configService: ConfigService = app.get(ConfigService);

  const frontendUrls = configService.get<string[]>('FRONTEND_URLS') || [];

  const corsConfig = {
    origin: frontendUrls,
    methods: 'HEAD,GET,POST,PUT,PATCH,DELETE,OPTIONS,TRACE,CONNECT',
    credentials: true, // allow cookies/Authorization headers
  };

  console.info('CORS configuration:', corsConfig);

  app.enableCors(corsConfig);
}

function configureSwagger(app: INestApplication<any>) {
  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('Auto-generated API docs')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Nhập JWT token',
        in: 'header',
      },
      'jwt',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    jsonDocumentUrl: '/api-json',
  });
}

function configureClassSerializer(app: INestApplication<any>) {
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
  );
}

function configureApp(app: INestApplication<any>) {
  configureClassSerializer(app);
  app.useGlobalPipes(new ValidationPipe());
  configureSwagger(app);
  configureCors(app);
  configureGlobalFilters(app);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  configureApp(app);

  const HOST = process.env.HOST || 'localhost';
  const PORT = process.env.PORT || 3000;

  console.log(`Starting server at http://${HOST}:${PORT}`);

  await app.listen(
    PORT,
    HOST,
  );
}
bootstrap();
