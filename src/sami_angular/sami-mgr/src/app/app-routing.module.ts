import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MapComponent } from "./map/map.component";
import { LoginComponent } from "./admin/login/login.component";
import { HomeComponent } from "./home/home.component";

/////Login has been switched to the form component for development purposes
const routes: Routes = [
  { path: "home", component: HomeComponent },
  { path: "map/:id", component: MapComponent },
  { path: "login", component: LoginComponent },
  // { path: '**', redirectTo: "/" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
