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
  featuresFilePath;

  constructor(private mapService: MapService, private fb: FormBuilder) {}

  ngOnInit() {
    const mapMetaData = this.mapService.getActiveMapMeta();
    console.log(mapMetaData);
    this.mapName = mapMetaData.mapName;
    this.area = mapMetaData.area;
    this.shapeFilePath = mapMetaData.shapeFilePath;
    this.featuresFilePath = mapMetaData.featuresFilePath;
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
