import { join } from 'path';

export function getOsEnv(key: string): string {
	return process.env[key];
}

export function getOsEnvRegex(key: string): RegExp | boolean {
	return (process.env[key] && new RegExp(process.env[key].slice(1, -1))) || false;
}

export function getPath(path: string): string {
	return process.env.NODE_ENV === 'production' || getOsEnvBoolean('USE_PRODUCTION_BUILD', 'false')
		? join(process.cwd(), path.replace('src/', 'dist/src/').slice(0, -3) + '.js')
		: join(process.cwd(), path);
}

export function getPaths(paths: string[]): string[] {
	return paths.map((p): any => getPath(p));
}

export function getOsPath(key: string): string | undefined {
	const path = getOsEnv(key);
	return path && getPath(path);
}

export function getOsPaths(key: string): string[] | undefined {
	const paths = getOsEnvArray(key) || [];
	if (paths.length) {
		return getPaths(paths);
	}
	return undefined;
}

export function getOsEnvArray(key: string, delimiter: string = ','): string[] {
	return (process.env[key] && process.env[key].split(delimiter)) || [];
}

export function getOsEnvObj(key: string): any {
	return JSON.parse(process.env[key] || '{}');
}

export function toNumber(value: string): number {
	return parseInt(value, 10);
}

export function toBool(value: string): boolean {
	return value === 'true';
}

export function getOsEnvBoolean(key: string, defaultValue?: string): boolean {
	return toBool(process.env[key] || defaultValue);
}

export function normalizePort(port: string): number | string | boolean {
	const parsedPort = parseInt(port, 10);
	if (isNaN(parsedPort)) {
		return port;
	}
	if (parsedPort >= 0) {
		return parsedPort;
	}
	return false;
}
export function toDecimal(value: string): number {
	return parseFloat(value);
}
