import { Container } from 'typedi';
import { DataSource, DataSourceOptions } from 'typeorm';
import { createDatabaseConnection } from '../loaders/ConnectionManager';

/**
 * Injects a DataSource instance into the constructor parameter using TypeDI.
 * @param name The name of the connection (default is 'default').
 */
export function InjectDataSource(name: string = 'default', connectionOptions?: DataSourceOptions): ParameterDecorator {
	return async (object, propertyName, index): Promise<void> => {
		const dataSource = await createDatabaseConnection(name, connectionOptions);

		propertyName = propertyName ? propertyName.toString() : '';

		Container.registerHandler({
			object,
			propertyName,
			index,
			value: (): DataSource => dataSource,
		});
	};
}
