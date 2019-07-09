import {Component, OnInit} from '@angular/core';
import {LoaderService} from './services/loader.service';
import {delay} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  isLoading = false;

  constructor(
    private loaderService: LoaderService,
    public translate: TranslateService
  ) {
    translate.addLangs(['en', 'fr']);
    translate.setDefaultLang('en');
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
  }

  ngOnInit() {
    this.loaderService.loadingSubscriber.pipe(delay(0)).subscribe(data => {
      this.isLoading = data;
    });
  }
}
