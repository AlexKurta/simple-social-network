import { Directive, Input, OnChanges, HostBinding } from '@angular/core';
import { DataService } from '../services/data.service';
import { User } from '../models/User';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Directive({
  selector: '[appOnline]'
})
export class OnlineDirective implements OnChanges {
  @Input() userId: string;
  private user: User;

  constructor(
    private dataService: DataService,
    private toastr: ToastrService
  ) {
  }

  ngOnChanges(): void {
    this.dataService.getUserById(this.userId).subscribe((user: User) => this.user = user,
      (error: HttpErrorResponse) => this.onError(error));
  }

  @HostBinding('style.color')
  private get color(): string {
    if (!this.user) {
      return;
    }
    return this.user.online ? 'green' : 'grey';
  }

  private onError(error: HttpErrorResponse): void {
    this.toastr.error(error.message, error.statusText);
  }
}
