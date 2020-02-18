import { Pipe, PipeTransform } from '@angular/core';

import {formatDistanceToNow, parseISO} from 'date-fns';

@Pipe({
  name: 'ago'
})
export class AgoPipe implements PipeTransform {

  transform(value: string, args?: any): any {
    return formatDistanceToNow(parseISO(value), {addSuffix: true})
  }

}
