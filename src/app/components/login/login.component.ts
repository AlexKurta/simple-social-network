import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/User';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login-signup',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent {
  public email: string;
  public password: string;
  public hidePassword = true;
  @ViewChild('form')
  form;
  @ViewChild('emailEl')
  emailEl;

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {
  }

  public onSubmit(): void {
    this.authService.login(this.email, this.password)
      .then((user: User) => {
        this.router.navigate(['/users']);
        this.authService.emitLoginEvent(user);
      })
      .catch(error => {
        this.toastr.error(error);
      });
  }

  public getEmailErrorMessage(): string {
    return this.emailEl.hasError('required') ? this.translate.instant('You must enter an Email') :
      this.emailEl.hasError('email') ? this.translate.instant('Not a valid email') : '';
  }
}
