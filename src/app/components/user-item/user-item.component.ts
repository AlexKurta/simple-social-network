import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../models/User';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { faGlobeAmericas } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.sass']
})
export class UserItemComponent implements OnInit {
  @Input() user: User;
  @Output() showDetailsEvent = new EventEmitter();
  public isAdmin = false;
  public faGlobeAmericas = faGlobeAmericas;

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    public dialog: MatDialog,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.getAuthUser().role === 'admin';
  }

  public showDetails(): void {
    this.showDetailsEvent.emit(this.user.id);
  }

  private deleteUser(): void {
    this.dataService.deleteUser(this.user.id).subscribe((data: object) => {
      this.dataService.emitDeleteUserEvent(data);
      this.toastr.info(`${this.user.username} ${this.translate.instant('was successfully deleted')}`);
    }, (error: HttpErrorResponse) => this.onError(error));
  }

  public openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {width: '350px'});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteUser();
      }
    });
  }

  public getOnlineStatus(): string {
    const status = this.user.online ? 'Online' : 'Offline';
    return this.translate.instant(status);
  }

  private onError(error: HttpErrorResponse): void {
    this.toastr.error(error.message, error.statusText);
  }
}
