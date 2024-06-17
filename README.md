## @nodegen/node-db

nodegen-node-db is an npm package that provides a convenient way to establish connections to different databases using the TypeORM library. It allows you to easily configure and create database connections by providing names and connection options. It also supports picking connection options from environment variables.

### Installation

You can install nodegen-node-db package via npm:

```bash
npm install @nodegen/node-db
```

### Example Usage

Creating database connections using environment variables in JavaScript:

```typescript
import { createDatabaseConnection } from "@nodegen/node-db";

try {
  // Default MongoDB connection (picks connection options from environment variables)
  const defaultMongoDBConnection = await createDatabaseConnection();

  // Custom MySQL connection
  const customMySQLConnection = await createDatabaseConnection(
    "mysqlConnection",
    {
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "root",
      database: "test_db2",
      entities: [],
      autoSchemaSync: true,
    }
  );

  console.log("Connections created successfully");
} catch (error: any) {
  console.log("An error occurred creating database connection");
} finally {
  await defaultMongoDBConnection.close();
  await customMySQLConnection.close();
}
```

### Setting up Environment Variables

| Sr. No. | Environment Variable Name | Default Value | Example Value                    |
| ------- | ------------------------- | ------------- | -------------------------------- |
| 1       | TYPEORM_CONNECTION        | mongodb       | mysql                            |
| 2       | TYPEORM_URL               |               | mongodb://localhost:27017/testdb |
| 3       | TYPEORM_HOST              |               | localhost, 192.168.0.100         |
| 4       | TYPEORM_PORT              | 27017         | 27017                            |
| 5       | TYPEORM_USERNAME          |               | test_user                        |
| 6       | TYPEORM_PASSWORD          |               | password                         |
| 7       | TYPEORM_DATABASE          |               | test database                    |
| 8       | TYPEORM_SYNCHRONIZE       | true/false    | true/false                       |
| 9       | TYPEORM_LOGGING           | false         | false                            |
| 10      | TYPEORM_REPLICA_SET       |               | replica_name                     |
| 11      | TYPEORM_SERVICE_NAME      | true/false    | service name (oracle)            |

### Supported Databases

- **Relational Databases:**

  - MySQL Database
  - Microsoft SQL Server
  - Oracle Database
  - PostgreSQL
  - SQLite

- **No-SQL Databases:**
  - MongoDB

It also supports connections to CockroachDB, SAP, HANA, and other databases through a generic driver.

### What's New?

- Simplified process of database connections
- Multiple connections supported
- More than 90 percent code coverage
- Added the functionality to release all DB connections: `await DatabaseManager.get().releaseAll()`
