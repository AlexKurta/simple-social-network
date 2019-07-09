import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  public canActivate(): boolean {
    const isLogin = this.authService.getAuthUser();
    if (isLogin.name) {
      this.router.navigate(['/users']);
      return false;
    } else {
      return true;
    }
  }
}
