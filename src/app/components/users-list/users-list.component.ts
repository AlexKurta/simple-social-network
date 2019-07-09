import { Component, OnInit } from '@angular/core';
import { User } from '../../models/User';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { faGlobeAmericas } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.sass']
})
export class UsersListComponent implements OnInit {
  public users: User[];
  public searchControl = new FormControl();
  public filteredUsers: User[];
  public faGlobeAmericas = faGlobeAmericas;

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
    this.dataService.deleteUserSubscriber.subscribe((data: object) => {
      if (data) {
        this.fetchUsers();
      }
    }, (error: HttpErrorResponse) => this.onError(error));

    // filter users by search value
    this.searchControl.valueChanges.pipe(debounceTime(500)).subscribe((value: User | string) => {
      if (typeof value === 'string') {
        const searchValue = value.toLowerCase();
        this.filteredUsers = this.users.filter((user: User) => {
          return user.name.toLowerCase().indexOf(searchValue) > -1 || user.username.toLowerCase().indexOf(searchValue) > -1;
        });
      } else {
        this.filteredUsers = [value];
      }
    }, (error: HttpErrorResponse) => this.onError(error));
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
    }, (error: HttpErrorResponse) => this.onError(error));
  }

  public getOnlineStatus(status: boolean): string {
    const hint = status ? 'Online' : 'Offline';
    return this.translate.instant(hint);
  }

  private onError(error: HttpErrorResponse): void {
    this.toastr.error(error.message, error.statusText);
  }
}
