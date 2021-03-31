import { Controller, Get, Param, Provider } from '@nestjs/common';
import { FilterService } from '../modules/filter';

// NOTE: This is a patcher class. Used as an example for FilterApi decorator controller.
// The constructor for this class isn't meant to be called.
// Rather, its used as a template to copy over routes into target controller
@Controller('filter')
export class FilterController<F extends FilterService, M = unknown> {
  // NOTE: Botched constructor. Better if removed from this class to avoid confusion
  constructor(private readonly filterService: F) {}

  @Get()
  public async getAllFilters(): Promise<M[]> {
    return this.filterService.fetchAll();
  }

  @Get('list')
  public async getListByKey(): Promise<string[]> {
    return this.filterService.fetchFilterKeys();
  }

  @Get(':key/:value')
  public async getAllFromKey(
    @Param('key') key: any,
    @Param('value') value: any
  ): Promise<M[]> {
    return this.filterService.fetchAndFilter(key, value);
  }

  @Get(':key/:op/:value')
  public async getAllFromKeyOp(
    @Param('key') key: any,
    @Param('value') value: any,
    @Param('op') op: any
  ): Promise<M[]> {
    return this.filterService.fetchAndFilter(key, value, op);
  }
}
