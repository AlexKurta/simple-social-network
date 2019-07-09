import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CustomMaterialModule} from '../custom-material-module/custom-material.module';
import {CreateEditRoutingModule} from './create-edit-routing.module';
import {CreateEditComponent} from './create-edit/create-edit.component';
import {NgxMaskModule} from 'ngx-mask';
import {HttpClient} from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [CreateEditComponent],
  imports: [
    CommonModule,
    CreateEditRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CustomMaterialModule,
    NgxMaskModule.forRoot(),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      isolate: false
    })
  ]
})
export class CreateEditModule {
}
