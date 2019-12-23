import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import flash = require('connect-flash');
import * as connectRedis from 'connect-redis';
import { NextFunction, Request, Response } from 'express';
import * as session from 'express-session';
import * as passport from 'passport';
import { AppController } from './app.controller';
import { contextMiddleware } from './middlewares';
import { StoreModule } from './modules/store/store.module';
import { ConfigService } from './shared/services/config.service';
import { SharedModule } from './shared/shared.module';
import * as helpers from './util/helpers';

const RedisStore = connectRedis(session);

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ConfigService) =>
        configService.config.database,
      inject: [ConfigService],
    }),
    StoreModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  constructor(private readonly configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        session({
          secret: this.configService.config.session.secret,
          resave: false,
          saveUninitialized: false,
          store: new RedisStore({}),
        }),
        passport.initialize(),
        passport.session(),
        flash(),
        (req: Request, res: Response, next: NextFunction) => {
          res.locals.h = helpers;
          res.locals.flashes = req.flash();
          res.locals.user = req.user || null;
          res.locals.currentPath = req.path;
          next();
        },
        contextMiddleware,
      )
      .forRoutes('*');
  }
}
