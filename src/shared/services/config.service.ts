import { Logger } from '@nestjs/common';
import { parse } from 'dotenv';
import { from } from 'env-var';
import { promises as fs } from 'fs';
import { SnakeNamingStrategy } from '../../util/snake-naming.strategy';
import { Config } from './interfaces/config.interface';

export class ConfigService {
  public readonly config: Config;

  constructor(envContent?: string) {
    const envConfig = process.env;
    if (envContent) {
      Object.assign(envConfig, parse(envContent));
    }

    // Replace \\n with \n to support multiline strings in AWS
    for (const envName of Object.keys(envConfig)) {
      envConfig[envName] = process.env[envName]!.replace(/\\n/g, '\n');
    }

    const env = from(envConfig);

    let entities = [__dirname + '/../../modules/**/*.entity{.ts,.js}'];
    let migrations = [__dirname + '/../../migrations/*{.ts,.js}'];

    if (module.hot) {
      const entityContext = require.context(
        './../../modules',
        true,
        /\.entity\.ts$/,
      );
      entities = entityContext.keys().map(id => {
        const entityModule = entityContext(id);
        const [entity] = Object.values(entityModule);
        return entity;
      });
      const migrationContext = require.context(
        './../../migrations',
        false,
        /\.ts$/,
      );
      migrations = migrationContext.keys().map(id => {
        const migrationModule = migrationContext(id);
        const [migration] = Object.values(migrationModule);
        return migration;
      });
    }

    this.config = {
      env: nodeEnv(),
      server: {
        port: env.get('PORT', '3000').asPortNumber(),
      },
      session: {
        secret: env
          .get('SECRET')
          .required()
          .asString(),
      },
      database: {
        entities,
        migrations,
        type: 'postgres',
        host: env.get('POSTGRES_HOST', 'localhost').asString(),
        port: env.get('POSTGRES_PORT', '5432').asPortNumber(),
        username: env.get('POSTGRES_USERNAME').asString(),
        password: env.get('POSTGRES_PASSWORD').asString(),
        database: env.get('POSTGRES_DATABASE').asString(),
        migrationsRun: env.get('POSTGRES_MIGRATIONS', 'true').asBool(),
        synchronize: env.get('POSTGRES_SYNCHRONIZE', 'true').asBool(),
        logging: env
          .get('POSTGRES_LOGGING', (nodeEnv() === 'development').toString())
          .asBool(),
        namingStrategy: new SnakeNamingStrategy(),
      },
    };
  }

  static async init() {
    let fd: fs.FileHandle | undefined;
    try {
      try {
        fd = await fs.open(`.env.${nodeEnv()}`, 'r');
      } catch (err) {
        if (err.code === 'ENOENT') {
          Logger.warn(`.env.${nodeEnv()} does not exist`, 'ConfigService');
        }
      }

      const content = await (fd && fd.readFile({ encoding: 'utf8' }));
      return new ConfigService(content);
    } finally {
      await (fd && fd.close());
    }
  }
}

function nodeEnv() {
  return process.env.NODE_ENV || 'development';
}
