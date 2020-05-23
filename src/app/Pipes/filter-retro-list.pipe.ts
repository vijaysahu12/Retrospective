import { Pipe, PipeTransform } from '@angular/core';
import { RetroType, RetrospectiveModel } from '../Modals/Retrospective.model';

@Pipe({
  name: 'filterRetroList'
})
export class FilterRetroListPipe implements PipeTransform {

  transform(retroList: RetrospectiveModel[], type: RetroType): any {
    return retroList.filter(x => x.Type === type);
  }
}
