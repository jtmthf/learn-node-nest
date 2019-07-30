import { parse } from 'dotenv';
import { promises as fs } from 'fs';
import { from } from 'env-var';
import { Config } from './interfaces/config.interface';
import { Logger } from '@nestjs/common';

export class ConfigService {
  public readonly config: Config;

  private constructor(envContent?: string) {
    const envConfig = process.env;
    if (envContent) {
      Object.assign(envConfig, parse(envContent));
    }

    // Replace \\n with \n to support multiline strings in AWS
    for (const envName of Object.keys(envConfig)) {
      envConfig[envName] = process.env[envName]!.replace(/\\n/g, '\n');
    }

    const env = from(envConfig);

    this.config = {
      server: {
        port: env.get('PORT', '3000').asPortNumber(),
      },
      database: {
        type: 'postgres',
        host: env.get('POSTGRES_HOST', 'localhost').asString(),
        port: env.get('POSTGRES_PORT', '5432').asPortNumber(),
        username: env.get('POSTGRES_USERNAME').asString(),
        password: env.get('POSTGRES_PASSWORD').asString(),
        database: env.get('POSTGRES_DATABASE').asString(),
        migrationsRun: env.get('POSTGRES_MIGRATIONS', 'true').asBool(),
        logging: env
          .get('POSTGRES_LOGGING', (nodeEnv() === 'development').toString())
          .asBool(),
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
