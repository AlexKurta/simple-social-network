import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../models/User';
import { DataService } from '../../services/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public isLogin = false;
  public isAdmin = false;
  public user: User;
  private subscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router,
    private dataService: DataService
  ) {
  }

  ngOnInit(): void {
    // subscribe on login event
    this.subscription.add(this.authService.loginSource$.subscribe((user: User) => {
      this.onLoginSubscribe(user);
    }));
    // subscribe on update user event
    this.subscription.add(this.dataService.updateUserSource$.subscribe((user: User) => {
      if (user.id === this.user.id) {
        this.user = user;
      }
    }));
    // set default props
    this.isAdmin = this.authService.isAdmin();
    this.isLogin = this.authService.checkAuth();
    this.user = this.authService.getAuthUser();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public logout(): void {
    this.authService.logout(this.user.id);
    this.isLogin = false;
    this.isAdmin = false;
    this.user = this.authService.emptyValue;
    this.router.navigate(['/login']);
  }

  private onLoginSubscribe(user: User): void {
    this.isLogin = true;
    this.user = user;
    this.isAdmin = this.authService.isAdmin();
  }
}
