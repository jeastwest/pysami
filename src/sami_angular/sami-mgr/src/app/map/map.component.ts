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
  showTable = false;
  showChart = false;
  showSettings = false;
  mapID: number;

  COLOR_INACTIVE = "rgba(255, 255, 255, 1)";
  COLOR_ACTIVE = "rgba(0, 255, 0, 1)";

  addLocationButtonBackgroundColor = this.COLOR_INACTIVE;

  addingLocation = false;

  constructor(
    private mapService: MapService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.mapID = +this.route.snapshot.paramMap.get("id");
    if (this.mapID) {
      this.mapService.initMap();
      this.mapService.activateMap(this.mapID);
    }
  }

  addFeature(): void {
    this.addingLocation = !this.addingLocation;
    this.mapService.setAddingLocation(this.addingLocation);
    if (this.addingLocation) {
      this.addLocationButtonBackgroundColor = this.COLOR_ACTIVE;
      this.snackBar.open("Click the map to add a source!", "Close", {
        // duration: 2000,
        verticalPosition: "bottom", // 'top' | 'bottom'
        // horizontalPosition: "center", //'start' | 'center' | 'end' | 'left' | 'right'
        panelClass: "add-location-snackbar", // expects class to be in styles.scss
      });
    } else {
      this.addLocationButtonBackgroundColor = this.COLOR_INACTIVE;
      this.snackBar.dismiss();
    }
  }

  back(): void {
    this.router.navigateByUrl("home");
  }
}
