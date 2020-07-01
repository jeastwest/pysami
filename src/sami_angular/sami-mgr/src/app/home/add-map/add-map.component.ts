import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UtilityService } from "src/app/services/utility.service";
import { Router } from "@angular/router";
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
      shapefileName: [null, Validators.required],
      featuresfileName: [null, Validators.required],
    });
  }

  addMap(): void {
    this.mapService
      .createMap(
        this.mapForm.get("mapName").value,
        this.mapForm.get("area").value,
        this.mapForm.get("shapefileName").value,
        this.mapForm.get("featuresfileName").value
      )
      .subscribe((response) => {
        console.log(response);
        // need to do error checking here
        this.router.navigateByUrl(`map/:${response.pk}`);
      });
  }
}
