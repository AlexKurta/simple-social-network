import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { DataService } from '../../services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/User';
import { FormGroup, Validators, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { IdService } from '../../services/id.service';
import { CheckUniquenessValidator } from '../../validators/check-uniqueness';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

const FILE_SIZE_LIMIT = 2500000;

@Component({
  selector: 'app-create-edit',
  templateUrl: './create-edit.component.html',
  styleUrls: ['./create-edit.component.sass']
})
export class CreateEditComponent implements OnInit, OnDestroy {
  public isEditPage: boolean;
  public user: User;
  public hidePassword = true;
  public imageUrl: string;
  @ViewChild('inputElement') inputElement: ElementRef;

  public form: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    city: ['', [Validators.required]],
    phone: this.formBuilder.array([
      this.formBuilder.control('', [Validators.required, Validators.minLength(11)])
    ]),
  }, {
    asyncValidators: [this.checkUniquenessValidator.validate.bind(this.checkUniquenessValidator)],
    updateOn: 'blur'
  });

  constructor(
    private dataService: DataService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private idService: IdService,
    private checkUniquenessValidator: CheckUniquenessValidator,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.isEditPage = !!this.activatedRoute.snapshot.params.id;
    if (this.isEditPage) {
      this.dataService.editUserId = this.activatedRoute.snapshot.params.id;
      this.dataService.getUserById(this.dataService.editUserId).subscribe((user: User) => {
        this.user = user;
        this.imageUrl = user.photo ? user.photo : '';
        for (let i = 0; i < user.phone.length - 1; i++) {
          this.addPhone();
        }
        this.form.patchValue(this.user);
      }, (error: HttpErrorResponse) => this.onError(error));
    }
  }

  ngOnDestroy(): void {
    if (this.isEditPage) {
      this.dataService.editUserId = '';
    }
  }

  private get name(): FormControl {
    return this.form.get('name') as FormControl;
  }

  private get nickname(): FormControl {
    return this.form.get('username') as FormControl;
  }

  private get email(): FormControl {
    return this.form.get('email') as FormControl;
  }

  private get password(): FormControl {
    return this.form.get('password') as FormControl;
  }

  private get address(): FormControl {
    return this.form.get('city') as FormControl;
  }

  private get phone(): FormArray {
    return this.form.get('phone') as FormArray;
  }

  public getErrorMessage(str: string): string {
    return `${str} ${this.translate.instant('is required')}!`;
  }

  public getEmailErrorMessage(): string {
    return this.email.hasError('required') ? this.translate.instant('You must enter an Email') :
      this.email.hasError('email') ? this.translate.instant('Not a valid email') : '';
  }

  public getPhoneErrorMessage(index: number): string {
    return this.phone.controls[index].hasError('required')
      ? this.translate.instant('You must enter phone number')
      : this.translate.instant('Phone number must contain 11 digits');
  }

  public getUniqueErrorMessage(): string {
    return this.form.hasError('uniqueEmail') ? this.translate.instant('User with such Email is exist') :
      this.form.hasError('uniqueNickname') ? this.translate.instant('User with such Nickname is exist') : '';
  }

  public addPhone(): void {
    this.phone.push(this.formBuilder.control('', [Validators.required]));
  }

  public deletePhone(index: number): void {
    this.phone.removeAt(index);
  }

  public onSubmit(): void {
    if (this.isEditPage) {
      // Update user
      this.dataService.editUser({...this.user, ...this.form.value, photo: this.imageUrl}).subscribe((user: User) => {
        this.router.navigate(['/users']);
        this.toastr.success(`${this.translate.instant('User')}: ${user.username} ${this.translate.instant('was successfully updated')}`);
        this.dataService.emitUpdateUserEvent(user);
      }, (error: HttpErrorResponse) => this.onError(error));
    } else {
      // Create user
      this.dataService.createUser({id: this.idService.getNewId(), ...this.form.value, photo: this.imageUrl}).subscribe((user: User) => {
        this.router.navigate([`/users/${user.id}`]);
        this.toastr.success(`${this.translate.instant('User')}: ${user.username} ${this.translate.instant('was successfully created')}`);
      }, (error: HttpErrorResponse) => this.onError(error));
    }
  }

  public addPhoto(event): void {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    if (file.size > FILE_SIZE_LIMIT) {
      this.deletePhoto();
      return;
    }
    const pattern = new RegExp(/image-*/);
    if (!pattern.test(file.type)) {
      this.toastr.error('invalid file format');
      return;
    }
    const reader = new FileReader();
    reader.onload = this.onReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  private onReaderLoaded(event): void {
    this.imageUrl = event.target.result;
  }

  public deletePhoto(): void {
    this.imageUrl = '';
    this.inputElement.nativeElement.value = null;
  }

  private onError(error: HttpErrorResponse): void {
    this.toastr.error(error.message, error.statusText);
  }
}
