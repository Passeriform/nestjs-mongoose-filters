import { DynamicModule, Module } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { ModuleOptions } from './filter.interface';
import { FilterService } from './filter.service';

@Module({})
export class FilterModule {
  public static register = (options: ModuleOptions): DynamicModule => {
    return {
      module: FilterModule,
      imports: [
        MongooseModule.forFeature([
          { name: options.model, schema: options.schema },
        ]),
      ],
      providers: [
        {
          provide: 'FILTER_MODEL',
          useFactory: (model: Model<unknown & Document>) => model,
          inject: [getModelToken(options.model)],
        },
        FilterService,
      ],
      exports: [FilterService],
    };
  };
}
