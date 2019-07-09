import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.sass']
})
export class FooterComponent {

  constructor(
    public translate: TranslateService,
    private toastr: ToastrService
  ) {
  }

  public changeLanguage(event): void {
    this.translate.use(event.value);
    const language = event.value === 'en' ? 'English' : 'Française';
    this.toastr.info(`${language} ${this.translate.instant('was selected')}`);
  }
}
