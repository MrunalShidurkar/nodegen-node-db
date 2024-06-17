import { DataSource, DataSourceOptions } from 'typeorm';
import { Container } from 'typedi';
import { env } from '../env';

export const createDatabaseConnection = async (name: string = 'default', connectionCredentials?: DataSourceOptions): Promise<DataSource> => {
	if (!Container.of(env.dataSourceContainerId).has(name)) {
		let sourceOptions = {
			name,
			type: env.db.type,
			url: env.db.url,
			host: env.db.host,
			port: env.db.port,
			username: env.db.username,
			password: env.db.password,
			database: env.db.database,
			synchronize: env.db.synchronize,
			logging: env.db.logging,
			entities: env.app.dirs.entities,
			migrations: env.app.dirs.migrations,
			replicaSet: env.db.replicaSet,
			migrationsRun: env.db.runMigrations,
			dropSchema: env.db.dropSchema,
			...(env.db.ssl.enabled && { ssl: { ca: env.db.ssl.ca } }),
			...connectionCredentials,
		};

		// Adjust options for MongoDB
		if (sourceOptions.type === 'mongodb') {
			sourceOptions = Object.assign(sourceOptions, { useUnifiedTopology: true });
		}

		// Adjust options for Oracle
		if (sourceOptions.type === 'oracle') {
			sourceOptions = Object.assign(sourceOptions, { serviceName: env.db.serviceName });
		}

		const dataSource = new DataSource(sourceOptions as any);
		await dataSource.initialize();
		Container.of(env.dataSourceContainerId).set(name, dataSource);
		return dataSource;
	}
	return Container.of(env.dataSourceContainerId).get(name);
};
