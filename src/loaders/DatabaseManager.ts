import { DataSource, DataSourceOptions } from 'typeorm';
import { Container, Service } from 'typedi';
import { Mutex } from 'async-mutex';
import { env } from '../env';

@Service({ global: true })
export class DatabaseManager {
	// Singleton instance of the DatabaseManager
	private static instance: DatabaseManager | undefined;

	// Mutex to lock the manager while creating or destroying connections
	private connectionMutex = new Mutex();

	// Map of connections
	private connections: Map<string, DataSource> = new Map();

	// Getter for the singleton instance of the DatabaseManager
	public static get(): DatabaseManager {
		if (!DatabaseManager.instance) {
			DatabaseManager.instance = Container.get(DatabaseManager);
		}
		return DatabaseManager.instance;
	}

	// Create a connection and store it in the manager
	public async createConnection(name: string = 'default', connectionCredentials?: any): Promise<DataSource> {
		const release = await this.connectionMutex.acquire();
		try {
			if (!this.connections.has(name)) {
				let sourceOptions: DataSourceOptions = connectionCredentials
					? { name, ...connectionCredentials }
					: {
							name,
							type: env.db.type as any,
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
					  };

				// Adjust options for MongoDB
				if (sourceOptions.type === 'mongodb') {
					sourceOptions = Object.assign(sourceOptions, { useUnifiedTopology: true });
				}

				// Adjust options for Oracle
				if (sourceOptions.type === 'oracle') {
					sourceOptions = Object.assign(sourceOptions, { serviceName: env.db.serviceName });
				}

				const dataSource = new DataSource(sourceOptions);
				await dataSource.initialize();
				this.connections.set(name, dataSource);
			}
		} finally {
			release();
			return this.connections.get(name);
		}
	}

	// Get the connection from the manager by name or throw an error if it does not exist
	public async getConnection(name: string = 'default'): Promise<DataSource> {
		await this.waitForMutexRelease();
		if (!this.connections.has(name)) {
			throw new Error('Connection Not Found');
		}
		return this.connections.get(name)!;
	}

	// Close the connection by name
	public async closeConnection(name: string = 'default'): Promise<boolean> {
		await this.waitForMutexRelease();
		if (!this.connections.has(name)) {
			throw new Error('Connection Not Found');
		}
		const dataSource = this.connections.get(name);
		await dataSource!.destroy();
		this.connections.delete(name);
		return true;
	}

	// Check if a connection exists by name
	public async hasConnection(name: string = 'default'): Promise<boolean> {
		await this.waitForMutexRelease();
		return this.connections.has(name);
	}

	// Release all connections and destroy the manager
	public async releaseAll(): Promise<any> {
		await this.waitForMutexRelease();
		for (const [_name, dataSource] of this.connections) {
			await dataSource.destroy();
		}
		this.connections.clear();
		this.connections = undefined!;
	}

	// Private method to wait for the mutex release
	private async waitForMutexRelease(): Promise<void> {
		if (this.connectionMutex.isLocked()) {
			await this.connectionMutex.waitForUnlock();
		}
	}
}
