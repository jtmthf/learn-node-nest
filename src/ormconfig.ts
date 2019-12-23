import * as dotenv from 'dotenv';
import { ConfigService } from './shared/services/config.service';

if (!module.hot /* for webpack HMR */) {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
}

dotenv.config({
  path: `.${process.env.NODE_ENV}.env`,
});

export default new ConfigService().config.database;
