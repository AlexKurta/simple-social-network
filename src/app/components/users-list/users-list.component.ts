import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../models/User';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { faGlobeAmericas } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.sass']
})
export class UsersListComponent implements OnInit, OnDestroy {
  public users: User[];
  public searchControl = new FormControl();
  public filteredUsers: User[];
  public faGlobeAmericas = faGlobeAmericas;
  private subscription: Subscription = new Subscription();

  constructor(
    private dataService: DataService,
    private router: Router,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    // fetch users from server
    this.fetchUsers();

    // subscribe on delete user event
    this.subscription.add(this.dataService.deleteUserSource$.subscribe((data: object) => {
      this.fetchUsers();
    }, this.onError));

    // filter users by search value
    this.subscription.add(this.searchControl.valueChanges.pipe(debounceTime(500)).subscribe((value: User | string) => {
      if (typeof value === 'string') {
        const searchValue = value.toLowerCase();
        this.filteredUsers = this.users.filter((user: User) => {
          return user.name.toLowerCase().indexOf(searchValue) > -1 || user.username.toLowerCase().indexOf(searchValue) > -1;
        });
      } else {
        this.filteredUsers = [value];
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public trackByFn(index: number): number {
    return index;
  }

  public showDetails(id: string): void {
    this.router.navigate([`/users/${id}`]);
  }

  private fetchUsers(): void {
    this.dataService.getAllUsers().subscribe((data: User[]) => {
      this.users = data;
      this.filteredUsers = data;
    }, this.onError);
  }

  public getOnlineStatus(status: boolean): string {
    const hint = status ? 'Online' : 'Offline';
    return this.translate.instant(hint);
  }

  private onError = (error: HttpErrorResponse) => {
    this.toastr.error(error.message, error.statusText);
    if (error.status === 404) {
      this.router.navigate(['**'])
    }
  }
}
