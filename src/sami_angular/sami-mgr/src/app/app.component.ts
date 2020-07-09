import { Component } from "@angular/core";
import { AuthService } from "./services/auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "sami-mgr";

  constructor(private auth: AuthService) {}

  userIsAuthenticated(): boolean {
    return this.auth.userIsAuthenticated();
  }
}
