import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { JwtModuleOptions } from '@nestjs/jwt';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { featureMap } from './featureMap';
import { Provider } from '@nestjs/common';
import { ServiceMap } from './serviceMap';
import { ConfigService } from '../services';
import * as env from 'dotenv';
env.config();

const config = new ConfigService();
console.log(config.dbHost);
export const DbConnectionAsync: TypeOrmModuleAsyncOptions = {
	inject: [ConfigService],
	useFactory: (cfg: ConfigService): TypeOrmModuleOptions => ({
		database: cfg.dbNAme,
		type: 'mysql',
		username: cfg.dbUsername,
		port: +cfg.dbPort,
		password: cfg.dbPassword,
		entities: ['dist/**/*.entity.js'],
		host: cfg.dbHost,
		synchronize: !!cfg.synchronize,
		dropSchema: !!cfg.dropSchema,
	}),
};

export const DBConnection: TypeOrmModuleOptions = {
	database: config.dbNAme,
	type: 'mysql',
	username: config.dbUsername,
	port: 3306,
	password: config.dbPassword,
	entities: ['dist/**/*.entity.js'],
	host: config.dbHost,
	synchronize: true,
	dropSchema: false,
};

export const jwtSettings: JwtModuleOptions = {
	secretOrPrivateKey: process.env.SECRET,
	global: true,
	signOptions: {
		expiresIn: process.env.EXPIRES_IN,
	},
};

export const typeOrmFeaturesFactory = (entityNames: string[]): EntityClassOrSchema[] =>
	entityNames.map((entityName) => {
		return featureMap.get(entityName);
	});

export const typeOrmProvidersFactory = (entityNames: string[]): Provider[] =>
	entityNames.map((entityName) => {
		return ServiceMap.get(entityName);
	});
