import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import {
  initializeTransactionalContext,
  patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';
import { AppModule } from './app.module';
import { ConfigService } from './shared/services/config.service';
import { SharedModule } from './shared/shared.module';
// import { FlubErrorHandler } from 'nestjs-flub';

async function bootstrap() {
  initializeTransactionalContext();
  patchTypeORMRepositoryWithBaseRepository();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.select(SharedModule).get(ConfigService);

  // view engine setup
  app.setViewEngine('pug');
  app.setBaseViewsDir(join(__dirname, '..', 'views'));

  // serves up static files from the public folder. Anything in public/ will just be served up as the file it is
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // if (configService.config.env === 'development') {
  //   app.useGlobalFilters(new FlubErrorHandler())
  // }

  await app.listen(configService.config.server.port);

  Logger.log(`🚀 server running on port ${configService.config.server.port}`);
}
bootstrap();
