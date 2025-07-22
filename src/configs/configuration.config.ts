export interface DatabaseConfig {
  host: string;
  port: number;
  uri: string;
}

export const database_config = () => ({
  database: {
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    uri: process.env.DATABASE_URI,
  },
});