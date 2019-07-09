import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IdService {

  public getNewId(): string {
    return Date.now().toString();
  }
}
