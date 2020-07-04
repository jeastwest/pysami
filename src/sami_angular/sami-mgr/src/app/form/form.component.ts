import { Component } from "@angular/core";

import { MapService } from "../services/map.service";
import { UtilityService } from "../services/utility.service";

@Component({
  selector: "app-form",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.scss"],
})
export class FormComponent {
  constructor(
    private mapService: MapService,
    private utilityService: UtilityService
  ) {}

  source = ["School", "Hospital", "WW Treatment", "Cemetery"];

  quitForm() {}

  openSnackBar(message: string, action: string) {}
}
