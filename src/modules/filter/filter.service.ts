import { Inject, Injectable } from '@nestjs/common';
import { Document, Model } from 'mongoose';

@Injectable()
export class FilterService {
  constructor(
    @Inject('FILTER_MODEL') private readonly filterModel: Model<any & Document>
  ) {}

  public fetchAll(): Promise<any[]> {
    return this.filterModel.find().exec();
  }

  public fetchFilterKeys(): Promise<string[]> {
    return this.filterModel
      .find()
      .exec()
      .then(docs => {
        const keys = docs.reduce(
          (keyAccumulator, currentDocObject) => [
            ...keyAccumulator,
            ...Object.keys(currentDocObject._doc).filter(key => key !== '_id'),
          ],
          []
        );

        return Array.from(new Set(keys));
      });
  }

  public fetchAndFilter(key: any, value: any, op?: any): Promise<any[]> {
    // TODO: Use another dynamic query-building service
    // HACK: Casting to any until Mongoose implements better type handling
    if (op) {
      return this.filterModel.find({ [key]: { [op]: value } } as any).exec();
    }

    return this.filterModel.find({ [key]: value } as any).exec();
  }
}
