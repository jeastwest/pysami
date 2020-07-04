import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

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
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.mapID = +this.route.snapshot.paramMap.get("id");
    if (this.mapID) {
      this.mapService.initMap();
      this.mapService.activateMap(this.mapID);
    }
  }

  addFeature(): void {
    console.log("add feature not yet implemented!");
    this.addingLocation = !this.addingLocation;
    if (this.addingLocation) {
      this.addLocationButtonBackgroundColor = this.COLOR_ACTIVE;
    } else {
      this.addLocationButtonBackgroundColor = this.COLOR_INACTIVE;
    }
  }

  back(): void {
    this.router.navigateByUrl("home");
  }
}
