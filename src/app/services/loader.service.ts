import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private isLoading: Subject<boolean> = new Subject<boolean>();
  public loadingSubscriber: Observable<boolean> = this.isLoading.asObservable();

  public startRequest(): void {
    this.isLoading.next(true);
  }

  public endRequest(): void {
    this.isLoading.next(false);
  }
}
