import { getOsEnv, getOsPaths, getPaths, toBool, toNumber, getOsEnvBoolean } from './lib/env';

/**
 * Environment variables configuration
 */
export const env = {
	node: process.env.NODE_ENV || 'development',
	isProduction: process.env.NODE_ENV === 'production',
	isTest: process.env.NODE_ENV === 'test',
	isDevelopment: process.env.NODE_ENV === 'development',
	dataSourceContainerId: process.env.DATASOURCE_CONTAINER_ID || 'datasource',
	app: {
		dirs: {
			migrations: getOsPaths('TYPEORM_MIGRATIONS') || getPaths(['src/database/migrations/**/*.ts']),
			entities: getOsPaths('TYPEORM_ENTITIES') || getPaths(['src/models/**/*.ts']),
		},
	},
	db: {
		type: getOsEnv('TYPEORM_CONNECTION') || 'mongodb',
		url: getOsEnv('TYPEORM_URL'),
		host: getOsEnv('TYPEORM_HOST'),
		port: toNumber(getOsEnv('TYPEORM_PORT')) || 27017,
		username: getOsEnv('TYPEORM_USERNAME'),
		password: getOsEnv('TYPEORM_PASSWORD'),
		database: getOsEnv('TYPEORM_DATABASE'),
		synchronize: toBool(getOsEnv('TYPEORM_SYNCHRONIZE') || 'false'),
		logging: getOsEnvBoolean('TYPEORM_LOGGING') || false,
		replicaSet: getOsEnv('TYPEORM_REPLICA_SET'),
		runMigrations: toBool(getOsEnv('TYPEORM_MIGRATIONS_RUN') || 'false'),
		dropSchema: toBool(getOsEnv('TYPEORM_DROP_SCHEMA') || 'false'),
		ssl: {
			enabled: toBool(getOsEnv('TYPEORM_SSL_ENABLED') || 'false'),
			ca: getOsEnv('TYPEORM_SSL_CERTIFICATE'),
		},
		serviceName: getOsEnv('TYPEORM_SERVICE_NAME'),
	},
};
