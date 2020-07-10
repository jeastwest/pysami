import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { UploaderService } from "../services/uploader.service";

@Component({
  selector: "app-form",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.scss"],
})
export class FormComponent {
  sourceForm: FormGroup;

  map_id;
  locationMarker;

  constructor(
    private uploaderService: UploaderService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.sourceForm = this.fb.group({
      name: [null, Validators.required],
      sourceType: [null, Validators.required],
      intensity: [null, Validators.required],
      dispersion: [null, Validators.required],
      lat: [this.locationMarker._latlng.lat, Validators.required],
      lng: [this.locationMarker._latlng.lng, Validators.required],
    });
  }

  addSource() {
    if (this.sourceForm.valid) {
      this.uploaderService
        .addSource({
          map_id: this.map_id,
          name: this.sourceForm.get("name").value,
          sourceType: this.sourceForm.get("sourceType").value,
          intensity: this.sourceForm.get("intensity").value,
          dispersion: this.sourceForm.get("dispersion").value,
          lat: this.sourceForm.get("lat").value,
          lng: this.sourceForm.get("lng").value,
        })
        .subscribe((response) => {
          this.locationMarker.closePopup();
          this.locationMarker.unbindPopup();
          let tooltipText = `
          <p>Name: ${response.name}</p>
          <p>Source Type: ${response.sourceType}</p>
          <p>Intensity: ${response.intensity}</p>
          <p>Dispersion: ${response.dispersion}</p>
          `;
          this.locationMarker.bindTooltip(tooltipText).openTooltip();
        });
    } else {
      // this needs some error messaging
      return;
    }
  }

  quitForm() {
    this.locationMarker.closePopup();
    this.locationMarker.remove();
  }
}
