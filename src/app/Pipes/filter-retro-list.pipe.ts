import { Pipe, PipeTransform } from '@angular/core';
import { RetroType, RetrospectiveModel } from '../Modals/Retrospective.model';

@Pipe({
  name: 'filterRetroList'
})
export class FilterRetroListPipe implements PipeTransform {

  transform(retroList: RetrospectiveModel[], typeRetro: RetroType): any {
    console.log('pipe called for: ' + typeRetro);
    return retroList.filter(x => x.type === typeRetro);
  }
}
