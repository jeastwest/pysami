import { Component, Input } from "@angular/core";

import { NgForm } from "@angular/forms";
import { MapService } from "../services/map.service";
import { MatSnackBar } from "@angular/material/snack-bar";

import { Source } from "../models/sources.model";
import { MapComponent } from "../map/map.component";
import { UtilityService } from "../services/utility.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";

@Component({
  selector: "app-form",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.scss"],
})
export class FormComponent {
  private sources: Source;
  constructor(
    private mapService: MapService,
    private mapComponent: MapComponent,
    private _snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private utilityService: UtilityService
  ) {}

  source = ["School", "Hospital", "WW Treatment", "Cemetery"];

  onSubmit(f: NgForm) {
    // const map_id = this.route.snapshot.paramMap.get("id"); //This is routing the form to the map_id that the user has selected
    // console.log(f.value)
    // const coordinates = this.mapComponent.clickedCoordinates
    // const Description = f.value.descrip;
    // console.log(Description)
    // const Intensity = f.value.buffer;
    // const Dispersion = f.value.dispersionParameter;
    // const Name = f.value.name
    // this.mapService.registerSource(map_id, coordinates[1], coordinates[0], Description, Intensity, Dispersion, Name)
    // this.mapComponent.addingSource = false;
    // this.mapService.updateLayers(map_id);
    // this.utilityService.getSelectedMapSources(map_id);
    // this.openSnackBar("Source Added!", "Ok")
  }

  quitForm(): any {
    this.mapComponent.addingSource = false;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
