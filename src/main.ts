import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core/nest-factory';

async function bootstrap() {
	const app: NestExpressApplication = await NestFactory.create<NestExpressApplication>(AppModule);

	await app.enableCors({
		allowedHeaders: '*',
		origin: '*',
	});

	const config = new DocumentBuilder()
		.setTitle('SberTube API')
		.setDescription('SberTube Sample API description')
		.setVersion('1.0')
		.addTag('SberTube API')
		.addBearerAuth(
			{
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT',
				name: 'JWT',
				description: 'Enter JWT token',
				in: 'header',
			},
			'Authorization',
		)
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	await app.listen(3001, 'localhost');
}
bootstrap();
