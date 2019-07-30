import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export interface Config {
  server: {
    port: number;
  };
  database: TypeOrmModuleOptions;
}
