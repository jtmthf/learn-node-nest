import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './store.entity';
import { StoreSubscriber } from './store.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([Store])],
  providers: [StoreSubscriber],
})
export class StoreModule {}
