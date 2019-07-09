import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../models/User';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {
  public isLogin = false;
  public isAdmin = false;
  public user: User;

  constructor(
    private authService: AuthService,
    private router: Router,
    private dataService: DataService
  ) {
  }

  ngOnInit(): void {
    // subscribe on login event
    this.authService.loginSubscriber.subscribe((user: User) => {
      if (user.name) {
        this.isLogin = true;
        this.user = user;
        this.isAdmin = this.authService.getAuthUser().role === 'admin';
      }
    });
    // subscribe on update user event
    this.dataService.updateUserSubscriber.subscribe((user: User) => {
      if (user.id && user.id === this.user.id) {
        this.user = user;
      }
    });
    // set default props
    this.isAdmin = this.authService.getAuthUser().role === 'admin';
    this.isLogin = this.authService.checkAuth();
    this.user = this.authService.getAuthUser();
  }

  public logout(): void {
    this.authService.logout(this.user.id);
    this.isLogin = false;
    this.isAdmin = false;
    this.user = this.authService.emptyValue;
    this.router.navigate(['/login']);
  }
}
