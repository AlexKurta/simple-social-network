import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/User';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

const BASE_URL = 'http://localhost:3000/users';
const HTTP_OPTIONS = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public emptyValue: User = {
    id: '',
    name: '',
    username: '',
    email: '',
    password: '',
    city: '',
    phone: [''],
    role: '',
    online: false
  };

  private loginSource = new Subject<User>();
  public loginSource$ = this.loginSource.asObservable();

  constructor(
    private http: HttpClient,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {
  }

  public login(email: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      this.getUserByEmail(email).subscribe((user: User[]) => {
        if (!user.length) {
          reject(new Error(this.translate.instant('User with such email not found')));
        } else if (user[0].password !== password) {
          reject(new Error(this.translate.instant('Invalid password')));
        } else {
          resolve(user[0]);
          localStorage.setItem('user', JSON.stringify(user[0]));
          this.setOnlineStatus(user[0].id, true).subscribe((data: User) => {
            this.toastr.success(`User: ${data.username} is login`);
          });
        }
      });
    });
  }

  public getUserByEmail(email: string): Observable<User[]> {
    return this.http.get<User[]>(`${BASE_URL}?email=${email}`);
  }

  public checkAuth(): boolean {
    return !!localStorage.getItem('user');
  }

  public getAuthUser(): User {
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user);
    } else {
      return this.emptyValue;
    }
  }

  public logout(id: string): void {
    localStorage.removeItem('user');
    this.setOnlineStatus(id, false).subscribe((data: User) => {
      this.toastr.info(`User: ${data.username} is logout`);
    });
  }

  public emitLoginEvent(user: User): void {
    this.loginSource.next(user);
  }

  private setOnlineStatus(id: string, status: boolean): Observable<User> {
    return this.http.patch<User>(`${BASE_URL}/${id}`, JSON.stringify({online: status}), HTTP_OPTIONS);
  }

  public isAdmin(): boolean {
    return this.getAuthUser().role === 'admin';
  }
}
