import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phones'
})
export class PhonesPipe implements PipeTransform {

  public transform(value: string): string {
    return `+(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 8)}-${value.slice(8, 11)}`;
  }
}
