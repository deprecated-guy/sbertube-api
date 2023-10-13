import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
	public secret = process.env.SECRET_KEY;
	public expires_in = process.env.EXPIRES_IN;
	public dbNAme = process.env.DB_NAME;
	public dbPassword = process.env.DB_PASSWORD;
	public dbHost = process.env.DB_HOST;
	public dbUsername = process.env.DB_USERNAME;
	public dbPort = process.env.DB_PORT;
}
