export const clonePropertyDescriptor = (
  target: any,
  property: string | number | symbol
): PropertyDescriptor => {
  const propertyDescriptor = Object.getOwnPropertyDescriptor(target, property);

  // Shallow clone to get a working copy to define property and metadata
  const newPropertyDescriptor = { ...propertyDescriptor };

  // Wrap the original function so that Reflect.defineMetadata gets applied to the
  // newly created function instead of to the prototype function of FilterController
  const routeControllerFunction = newPropertyDescriptor.value;
  newPropertyDescriptor.value = function(...args: unknown[]) {
    return routeControllerFunction.bind(this)(...args);
  };

  // Copy over metadata content to the new descriptor
  Reflect.getOwnMetadataKeys(propertyDescriptor.value).forEach(metadataKey =>
    Reflect.defineMetadata(
      metadataKey,
      Reflect.getOwnMetadata(metadataKey, propertyDescriptor.value),
      newPropertyDescriptor.value
    )
  );

  return newPropertyDescriptor;
};
