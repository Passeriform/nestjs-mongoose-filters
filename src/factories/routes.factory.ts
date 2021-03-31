import { Inject } from '@nestjs/common';
import { PARAMTYPES_METADATA } from '@nestjs/common/constants';
import { clonePropertyDescriptor } from '../utility';
import { getControllerPathPrefix, patchRoutePathMetadata } from './filter-factory.helper';
import { FilterFactoryProps } from './filter-factory.interface';
import { FilterController } from './filter.controller';

export class RoutesFactory {
  constructor(protected target: any, options: FilterFactoryProps) {
    const routesController = options ?.routesController || FilterController;

    // Fetch prefix from the controller to be prepended before each patched route
    const prefixRoutePath = getControllerPathPrefix(routesController);

    /* SPIKE: Service Injector
     * Created to inject service directly into the controller of the decorated class
     * Dropped in favor of manual specification to prevent confusion in understanding
     * Kept to be later incorporated as an optional feature

     // Define service injection receptor member into the controller
     defineServiceReceptor(target, options)

     // Injecting service into target controller
     const filterServiceInjector = Inject(options ?.filterService || FilterService)
     filterServiceInjector(target.prototype, 'filterService')
    */

    // Copy over the routes from patch controller to the target controller
    Reflect.ownKeys(routesController.prototype).forEach(
      (property) => {
        if (!['constructor', 'toString', 'length'].includes(property.toString())) {
          // Clone route descriptor from patcher controller to create an independent route signature
          const newPropertyDescriptor = clonePropertyDescriptor(
            routesController.prototype,
            property,
          );

          // Add new route to the target controller
          Object.defineProperty(
            target.prototype,
            property,
            newPropertyDescriptor,
          );

          // Prepend the patch controller prefix to every route
          patchRoutePathMetadata(target.prototype[property], prefixRoutePath);
        }
      });
  }
}

/* SPIKE: Service Injector (contd.)
 * The receptor definition

 const defineServiceReceptor = (target, options) => {
  // Describe empty service descriptor member
  const filterServiceDescriptor: TypedPropertyDescriptor<FilterService> = {
    value: undefined,
    writable: true
  }

  // Add empty descriptor to controller (Satisfies property check for service)
  Object.defineProperty(
    target.prototype,
    'filterService',
    filterServiceDescriptor
  )
 }
*/
