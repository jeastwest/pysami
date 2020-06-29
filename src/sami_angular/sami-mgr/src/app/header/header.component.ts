import { Component, OnInit, AfterViewInit } from "@angular/core";

import { AuthService } from "../services/auth.service";
import { environment } from "../../environments/environment";
import { Router } from "@angular/router";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit, AfterViewInit {
  constructor(public auth: AuthService) {}

  ngOnInit(): void {
    this.auth.loadCredentials();
  }

  ngAfterViewInit(): void {
    this.auth.loadCredentials();
  }

  userIsAuthenticated(): boolean {
    return this.auth.userIsAuthenticated();
  }
}
