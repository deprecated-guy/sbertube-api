import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	await app.enableCors({
		allowedHeaders: '*',
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

	await app.listen(3001);
}
bootstrap();
