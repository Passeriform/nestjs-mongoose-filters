import { FilterService } from '../modules/filter';
import { FilterController } from './filter.controller';
import { RoutesFactory } from './routes.factory';

export interface FilterFactoryOptions {
  filterPrefix?: string;
  filterService?: typeof FilterService;
  routesFactory?: typeof RoutesFactory;
  routesController?: typeof FilterController;
}

export interface FilterFactoryProps extends FilterFactoryOptions {}
