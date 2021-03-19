import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateprofileComponent } from './components/createprofile/createprofile.component';
import { LoginComponent } from './components/login/login.component';
import { UpsertParamsComponent } from './components/upsert-params/upsert-params.component';
import { AddKnowledgebaseComponent } from './components/add-knowledgebase/add-knowledgebase.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ViewProfileComponent } from './components/view-profile/view-profile.component';
import { ListProfilesComponent } from './components/list-profiles/list-profiles.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateprofileComponent,
    LoginComponent,
    UpsertParamsComponent,
    AddKnowledgebaseComponent,
    DashboardComponent,
    ViewProfileComponent,
    ListProfilesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // import HttpClientModule after BrowserModule.
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
