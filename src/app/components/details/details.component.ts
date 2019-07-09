import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/User';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.sass']
})
export class DetailsComponent implements OnInit {
  private userId: string;
  public user: User;
  public isAdmin = false;

  constructor(
    private dataService: DataService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    public translate: TranslateService,
  ) {
  }

  ngOnInit(): void {
    this.userId = this.activatedRoute.snapshot.params.id;
    this.dataService.getUserById(this.userId).subscribe((user: User) => this.user = user,
      (error: HttpErrorResponse) => this.onError(error));
    this.isAdmin = this.authService.getAuthUser().role === 'admin';
  }

  public editUser(): void {
    this.router.navigate([`/users/${this.userId}/edit`]);
  }

  private deleteUser(): void {
    this.dataService.deleteUser(this.userId).subscribe(data => {
      this.dataService.emitDeleteUserEvent(data);
      this.router.navigate([`/users`]);
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

  private onError(error: HttpErrorResponse): void {
    this.toastr.error(error.message, error.statusText);
  }
}
