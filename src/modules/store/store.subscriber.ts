import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import slugify from 'slugify';
import {
  Connection,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { Store } from './store.entity';

@Injectable()
export class StoreSubscriber implements EntitySubscriberInterface<Store> {
  constructor(@InjectConnection() connection: Connection) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return Store;
  }

  beforeInsert(event: InsertEvent<Store>) {
    this.setSlug(event.entity);
  }

  beforeUpdate(event: UpdateEvent<Store>) {
    if (event.updatedColumns.some(meta => meta.propertyName === 'name')) {
      this.setSlug(event.entity);
    }
  }

  private setSlug(store: Store) {
    store.slug = slugify(store.name);
  }
}
