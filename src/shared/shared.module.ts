import { Module, Global } from '@nestjs/common';
import { ConfigService } from './services/config.service';

@Global()
@Module({
  providers: [{ provide: ConfigService, useFactory: ConfigService.init }],
  exports: [ConfigService],
})
export class SharedModule {}
