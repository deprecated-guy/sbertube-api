import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { JwtModuleOptions } from '@nestjs/jwt';
import { ServeStaticModuleOptions } from '@nestjs/serve-static';
import { join } from 'path';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { featureMap } from './featureMap';
import { Provider } from '@nestjs/common';
import { ServiceMap } from './serviceMap';

export const DBConnection: TypeOrmModuleOptions = {
	database: 'sbtb',
	type: 'mysql',
	username: 'root',
	port: 3306,
	password: '',
	entities: ['dist/**/*.entity.js'],
	host: 'localhost',
	synchronize: true,
};

export const jwtSettings: JwtModuleOptions = {
	secretOrPrivateKey: process.env.SECRET,
	global: true,
	signOptions: {
		expiresIn: process.env.EXPIRES_IN,
	},
};

export const serveStaticOptions: ServeStaticModuleOptions = {
	rootPath: join(__dirname, '..', 'static'),
	renderPath: '',
};

export const typeOrmFeaturesFactory = (
	entityNames: string[],
): EntityClassOrSchema[] =>
	entityNames.map((entityName) => {
		return featureMap.get(entityName);
	});

export const typeOrmProvidersFactory = (entityNames: string[]): Provider[] =>
	entityNames.map((entityName) => {
		return ServiceMap.get(entityName);
	});
