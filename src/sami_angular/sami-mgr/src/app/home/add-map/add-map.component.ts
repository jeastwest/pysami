import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { MapService } from "src/app/services/map.service";

@Component({
  selector: "app-add-map",
  templateUrl: "./add-map.component.html",
  styleUrls: ["./add-map.component.scss"],
})
export class AddMapComponent implements OnInit {
  mapForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private mapService: MapService
  ) {}

  ngOnInit(): void {
    this.mapForm = this.fb.group({
      mapName: [null, Validators.required],
      area: [null, Validators.required],
      shapeFilePath: [null, Validators.required],
      featureFilePath: [null, Validators.required],
    });
  }

  addMap(): void {
    this.mapService
      .createMap(
        this.mapForm.get("mapName").value,
        this.mapForm.get("area").value,
        this.mapForm.get("shapeFilePath").value,
        this.mapForm.get("featureFilePath").value
      )
      .subscribe((response) => {
        // need to do error checking here
        this.router.navigateByUrl(`/map/${response.id}`);
      });
  }
}
