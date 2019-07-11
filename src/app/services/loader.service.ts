import { Observable, Subject } from 'rxjs';

export class LoaderService {
  private isLoading: Subject<boolean> = new Subject<boolean>();
  public isLoading$: Observable<boolean> = this.isLoading.asObservable();

  public startRequest(): void {
    this.isLoading.next(true);
  }

  public endRequest(): void {
    this.isLoading.next(false);
  }
}
