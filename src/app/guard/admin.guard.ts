import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {
  }

  public canActivate(): boolean {
    const isAdmin = this.authService.getAuthUser().role === 'admin';
    if (!isAdmin) {
      this.router.navigate(['/users']);
      return false;
    } else {
      return true;
    }
  }
}
