import { Component, OnInit, AfterViewInit } from '@angular/core';

import { AuthService } from "../services/auth.service";

import { CookieService } from "ngx-cookie-service";

import { HeaderComponent } from '../header/header.component';
import { MapComponent } from '../map/map.component';
import { LoginComponent } from '../admin/login/login.component'

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(private auth: AuthService,
    private cookieService: CookieService) { }

  ngOnInit() {
    this.auth.checkForStoredToken(
      this.cookieService.get("JWT_TOKEN"),
      this.cookieService.get("JWT_REFRESH_TOKEN")

    );
    console.log("Logged in = " + this.isAuthenticated())
  }


  isAuthenticated(): boolean {
    return this.auth.isAuthenticated();
  }

  //   autoLogout() {
  //     setTimeout(() => {
  //       this.auth.logout()
  //     }, 3000);

  //   }
}