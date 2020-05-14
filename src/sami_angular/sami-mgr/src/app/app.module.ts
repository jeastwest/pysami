import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { CookieService } from "ngx-cookie-service";

import { EffectsModule } from "@ngrx/effects";

import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTableModule } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';

import { AuthService } from "./services/auth.service";
import { AuthEffects } from "./store/effects/auth.effects";
import { PopUpService } from './services/pop-up.service';
import { StudyAreaService } from './services/study-area.service';
import { MapService } from './services/map.service'
import { UtilityService } from './services/utility.service';

import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './admin/login/login.component';
import { UsersComponent } from './admin/users/users.component'
import { RegistrationComponent } from './admin/registration/registration.component';
import { UserEditorComponent } from './admin/user-editor/user-editor.component';
import { MapComponent } from './map/map.component';
import { FormComponent } from './form/form.component';
import { FormsModule } from '@angular/forms';
import { TableComponent } from './table/table.component';
import { ChartComponent } from './chart/chart.component';
import { SettingsComponent } from './settings/settings.component';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    MainComponent,
    LoginComponent,
    UsersComponent,
    RegistrationComponent,
    UserEditorComponent,
    MapComponent,
    FormComponent,
    TableComponent,
    ChartComponent,
    SettingsComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatToolbarModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatTabsModule,
    MatRadioModule,
    FormsModule,
  ],
  providers:
    [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
