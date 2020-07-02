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
      gradientType: ["relative", null],
      absThreshold: ["10000", null],
    });
  }
  public setGradientType() {
    const gradient = this.gradientForm.get("gradientType").value;
    console.log(gradient);
    this.mapService.setGradientType(gradient);
  }

  public getGradientType() {
    return this.mapService.getGradientType();
  }
}
