import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/User';
import { Observable, Subject } from 'rxjs';

const BASE_URL = 'http://localhost:3000/users';
const HTTP_OPTIONS = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public editUserId: string;

  // Delete user event
  private deleteUserSource = new Subject();
  public deleteUserSource$ = this.deleteUserSource.asObservable();

  // Edit user event
  private updateUserSource = new Subject<User>();
  public updateUserSource$ = this.updateUserSource.asObservable();

  constructor(private http: HttpClient) {
  }

  public getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(BASE_URL);
  }

  public createUser(user: User): Observable<User> {
    return this.http.post<User>(BASE_URL, JSON.stringify(user), HTTP_OPTIONS);
  }

  public deleteUser(id: string): Observable<object> {
    return this.http.delete(`${BASE_URL}/${id}`);
  }

  public editUser(user: User): Observable<User> {
    return this.http.put<User>(`${BASE_URL}/${user.id}`, JSON.stringify(user), HTTP_OPTIONS);
  }

  public getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${BASE_URL}/${id}`);
  }

  public getUserByEmail(email: string): Observable<User[]> {
    return this.http.get<User[]>(`${BASE_URL}?email=${email}`);
  }

  public getUserByNickname(nickname: string): Observable<User[]> {
    return this.http.get<User[]>(`${BASE_URL}?username=${nickname}`);
  }

  public emitDeleteUserEvent(data): void {
    this.deleteUserSource.next(data);
  }

  public emitUpdateUserEvent(user: User): void {
    this.updateUserSource.next(user);
  }
}
