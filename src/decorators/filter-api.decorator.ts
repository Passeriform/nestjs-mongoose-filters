import { FilterFactoryOptions, RoutesFactory } from '../factories';

type Constructor = new (...args: any[]) => unknown;

// TODO: Create an interceptor for selective filter application like paginate
// TODO: Add documentation for everything
// TODO: Add minimal jest tests
export const FilterApi = (options?: FilterFactoryOptions) => <T extends Constructor>(target: T): void => {
  const routesFactory = new (options ?.routesFactory || RoutesFactory)(target, options);
};
