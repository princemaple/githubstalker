import { Pipe, PipeTransform } from '@angular/core';

import {distanceInWordsToNow} from 'date-fns';

@Pipe({
  name: 'ago'
})
export class AgoPipe implements PipeTransform {

  transform(value: Date | string | number, args?: any): any {
    return `${distanceInWordsToNow(value)} ago`;
  }

}