export const CLASS_KEYS = 'classKey';
export const DESCRIPTORS = 'descriptors';
export const DESCRIPTOR_VALUES = 'descriptorValues';
export const PROPERTIES_MAP = 'propertiesMap';
export const FULL_METADATA = 'fullMetadata';

export const metaPrint = (
  target: { prototype: any },
  printKey?: string
): void => {
  const classKeys = Reflect.ownKeys(target.prototype).filter(
    key => !['constructor', 'toString', 'length'].includes(key.toString())
  );

  const descriptors = classKeys.map(ckey =>
    Reflect.getOwnPropertyDescriptor(target.prototype, ckey)
  );

  const descriptorValues = descriptors.map(descriptor =>
    descriptor.value.toString()
  );

  const propertyMetadataMap = classKeys.map(ckey => ({
    classKey: ckey,
    metadataKeys: Reflect.getOwnMetadataKeys(target.prototype[ckey]),
  }));
  const fullMetadata = propertyMetadataMap.map(mapEntry => ({
    classKey: mapEntry.classKey,
    metadataMap: mapEntry.metadataKeys.map(mdkey => ({
      metadataKey: mdkey,
      metadataValues: Reflect.getOwnMetadata(
        mdkey,
        target.prototype[mapEntry.classKey]
      ),
    })),
  }));

  const printMap = {
    CLASS_KEYS: classKeys,
    DESCRIPTORS: descriptors,
    DESCRIPTOR_VALUES: descriptorValues,
    PROPERTIES_MAP: propertyMetadataMap,
  };

  if (!printKey || printKey === FULL_METADATA) {
    fullMetadata.map(md => console.log(md));
  } else {
    console.log(printMap[printKey]);
  }
};
