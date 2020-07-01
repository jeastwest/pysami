import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AuthService } from "../../services/auth.service";
import { MapService } from "../../services/map.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loggingIn: boolean;
  errorMessage: string;
  registeringUser = false;

  constructor(
    private auth: AuthService,
    public mapService: MapService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loggingIn = false;
    this.errorMessage = "";
  }

  login(username: HTMLInputElement, password: HTMLInputElement): void {
    if (username.value.length < 1 || password.value.length < 1) {
      alert("Username and Password are required");
      return;
    }

    this.loggingIn = true;
    this.errorMessage = "";
    this.auth.login(username.value, password.value).subscribe((response) => {
      this.handleLoginResponse(response);
    });
  }

  handleLoginResponse(response): void {
    // this endpoint returns a SimpleJWT object on success
    this.loggingIn = false;
    if (response.error) {
      console.log("Error:loginResponse: " + response.error);
      this.errorMessage = response.error;
    } else {
      this.auth.getUser().subscribe((user) => {
        this.router.navigateByUrl("/home");
      });
    }
  }

  register(): void {
    this.registeringUser = true;
  }

  isRegistering($event): void {
    this.registeringUser = $event;
  }
}
