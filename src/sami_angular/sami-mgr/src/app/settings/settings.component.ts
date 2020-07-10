import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";

import { MapService } from "../services/map.service";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent implements OnInit {
  gradientForm: FormGroup;

  mapName;
  area;
  shapeFilePath;
  featureFilePath;

  constructor(private mapService: MapService, private fb: FormBuilder) {}

  ngOnInit() {
    const map = this.mapService.getActiveMap();
    this.mapName = map.mapName;
    this.area = map.area;
    this.shapeFilePath = map.shapeFilePath;
    this.featureFilePath = map.featureFilePath;
    this.gradientForm = this.fb.group({
      gradientType: new FormControl(this.getGradientType(), null),
      absThreshold: new FormControl(this.mapService.getAbsThreshold(), null),
    });
  }

  setGradientType(type) {
    this.mapService.setGradientType(type);
  }

  getGradientType(): string {
    return this.mapService.getGradientType();
  }

  setGradientAbsThreshold() {
    this.mapService.setAbsThreshold(
      this.gradientForm.get("absThreshold").value
    );
  }
}
