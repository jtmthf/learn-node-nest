import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export interface Config {
  env: string;
  server: {
    port: number;
  };
  session: {
    secret: string;
  };
  database: TypeOrmModuleOptions;
}
