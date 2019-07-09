import { Injectable } from '@angular/core';
import { AsyncValidator, ValidationErrors, FormGroup } from '@angular/forms';
import { catchError, map } from 'rxjs/operators';
import { Observable, zip } from 'rxjs';
import { DataService } from '../services/data.service';

@Injectable({providedIn: 'root'})
export class CheckUniquenessValidator implements AsyncValidator {
  constructor(private dataService: DataService) {
  }

  public validate(control: FormGroup): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    const email = control.get('email').value;
    const nickname = control.get('username').value;
    const email$ = this.dataService.getUserByEmail(email);
    const nickname$ = this.dataService.getUserByNickname(nickname);

    return zip(email$, nickname$).pipe(map(([userByEmail, userByNickname], index) => {
      let uniqueEmail, uniqueNickname;
      const editUserId = this.dataService.editUserId;
      if (editUserId) {
        // Update user
        uniqueEmail = userByEmail.length && userByEmail[index].id !== editUserId ? {uniqueEmail: true} : null;
        uniqueNickname = userByNickname.length && userByNickname[index].id !== editUserId ? {uniqueNickname: true} : null;
      } else {
        // Create new user
        uniqueEmail = userByEmail.length ? {uniqueEmail: true} : null;
        uniqueNickname = userByNickname.length ? {uniqueNickname: true} : null;
      }
      return uniqueEmail ? uniqueEmail : uniqueNickname;
    }), catchError(() => null));
  }
}
