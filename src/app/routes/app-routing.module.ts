import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageNotFoundComponent } from '../components/page-not-found/page-not-found.component';
import { UsersListComponent } from '../components/users-list/users-list.component';
import { DetailsComponent } from '../components/details/details.component';
import { LoginComponent } from '../components/login/login.component';

import { AuthGuard } from '../guard/auth.guard';
import { AdminGuard } from '../guard/admin.guard';
import { LoginGuard } from '../guard/login.guard';

const routes: Routes = [
  {path: '', redirectTo: 'users', pathMatch: 'full', canActivate: [AuthGuard]},
  {path: 'users', component: UsersListComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent, canActivate: [LoginGuard]},
  {path: 'users/:id', component: DetailsComponent, canActivate: [AuthGuard]},
  {path: 'users/:id/edit', loadChildren: '../create-edit/create-edit.module#CreateEditModule', canActivate: [AuthGuard, AdminGuard]},
  {path: 'create', loadChildren: '../create-edit/create-edit.module#CreateEditModule', canActivate: [AuthGuard, AdminGuard]},
  {path: '**', component: PageNotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, AdminGuard, LoginGuard]
})
export class AppRoutingModule {
}
