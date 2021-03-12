import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from './authentication.guard';
import { AddKnowledgebaseComponent } from './components/add-knowledgebase/add-knowledgebase.component';
import { CreateprofileComponent } from './components/createprofile/createprofile.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ListProfilesComponent } from './components/list-profiles/list-profiles.component';
import { LoginComponent } from './components/login/login.component';
import { UpsertParamsComponent } from './components/upsert-params/upsert-params.component';
import { ViewProfileComponent } from './components/view-profile/view-profile.component';

const routes: Routes = [
  { path: '', redirectTo: "login", pathMatch: 'full', },
  { path: 'login', component: LoginComponent },
  { path: 'profiles', component: ListProfilesComponent, canActivate: [AuthenticationGuard] },
  { path: 'profiles/create', component: CreateprofileComponent, canActivate: [AuthenticationGuard] },
  { path: 'profile', component: ViewProfileComponent, canActivate: [AuthenticationGuard] },
  { path: 'parameters', component: UpsertParamsComponent, canActivate: [AuthenticationGuard] },
  { path: 'knowledge', component: AddKnowledgebaseComponent, canActivate: [AuthenticationGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthenticationGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
