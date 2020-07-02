import { AfterViewInit, Component, Output, EventEmitter } from "@angular/core";

import { Location } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";

import { UserMap } from "../models/maps.model";

import * as L from "leaflet";
import * as GeoJSON from "node_modules/geojson";
import * as fullscreen from "leaflet.fullscreen";
import { icon, Marker } from "leaflet";
import { MapService } from "../services/map.service";
import { UtilityService } from "../services/utility.service";
import { FormComponent } from "../form/form.component";
import { TableComponent } from "../table/table.component";

import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";

import "node_modules/leaflet.fullscreen/Control.FullScreen.js";

const fullscreenUrl = "assets/icon-fullscreen.png";
const iconRetinaUrl = "assets/marker-icon-2x.png";
const iconUrl = "assets/marker-icon.png";
const shadowUrl = "assets/marker-shadow.png";
declare var fullscreen: any;

const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"],
})
export class MapComponent {
  showTable = false;
  showChart = false;
  showSettings = false;
  public clickedCoordinates;

  @Output() registeringSource = new EventEmitter<boolean>();
  mapID: number;
  waitingForResponse: boolean;
  errorMessage: string;
  addingSource = false;

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
  }

  back(): void {
    this.router.navigateByUrl("home");
  }
}
