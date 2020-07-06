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

  constructor(private mapService: MapService, private fb: FormBuilder) {}

  ngOnInit() {
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
