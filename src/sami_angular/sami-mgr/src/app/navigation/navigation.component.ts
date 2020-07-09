import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-navigation",
  templateUrl: "./navigation.component.html",
  styleUrls: ["./navigation.component.scss"],
})
export class NavigationComponent implements OnInit {
  user = { username: "" };
  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit(): void {}

  getUsername(): string {
    return this.auth.getUsername();
  }

  gotoMaps(): void {
    this.router.navigateByUrl("/home");
  }

  logout(): void {
    this.auth.logout();
  }
}
