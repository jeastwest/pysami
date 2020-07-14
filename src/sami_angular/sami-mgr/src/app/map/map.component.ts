import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { MatSnackBar } from "@angular/material/snack-bar";

import { MapService } from "../services/map.service";

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"],
})
export class MapComponent {
  map_id;
  showTools = false;
  showSettings = false;
  showSourceTools = false;
  showChart = false;

  COLOR_INACTIVE = "rgba(255, 255, 255, 1)";
  COLOR_ACTIVE = "rgba(25, 126, 192, 1)";

  addLocationButtonBackgroundColor = this.COLOR_INACTIVE;

  addingSource = false;

  constructor(
    private mapService: MapService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.map_id = this.route.snapshot.paramMap.get("id");
    if (this.map_id) {
      this.mapService.initMap();
      this.mapService.activateMap(this.map_id);
    }
  }

  addFeature(): void {
    this.addingSource = !this.addingSource;
    this.mapService.setaddingSource(this.addingSource);
    if (this.addingSource) {
      this.addLocationButtonBackgroundColor = this.COLOR_ACTIVE;
      this.snackBar.open("Click the map to add a source!", "Close", {
        duration: 5000,
        verticalPosition: "bottom", // 'top' | 'bottom'
        // horizontalPosition: "center", //'start' | 'center' | 'end' | 'left' | 'right'
        panelClass: "add-location-snackbar", // expects class to be in styles.scss
      });
    } else {
      this.addLocationButtonBackgroundColor = this.COLOR_INACTIVE;
      this.snackBar.dismiss();
    }
  }

  uploadSourceFile() {
    console.log("map.component: source.csv file upload not yet implemented");
  }

  getButtonBackgroundColor(active: boolean) {
    return active ? this.COLOR_ACTIVE : this.COLOR_INACTIVE;
  }

  back(): void {
    this.router.navigateByUrl("/home");
  }
}
