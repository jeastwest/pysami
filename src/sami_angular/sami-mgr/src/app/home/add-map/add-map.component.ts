import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UtilityService } from "src/app/services/utility.service";

@Component({
  selector: "app-add-map",
  templateUrl: "./add-map.component.html",
  styleUrls: ["./add-map.component.scss"],
})
export class AddMapComponent implements OnInit {
  mapForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private utilityService: UtilityService
  ) {}

  ngOnInit(): void {
    this.mapForm = this.fb.group({
      mapname: [null, Validators.required],
      cityname: [null, Validators.required],
      shapefileName: [null, Validators.required],
      featuresfileName: [null, Validators.required],
    });
  }

  addMap(): void {
    this.utilityService
      .createMap(
        this.mapForm.get("mapname").value,
        this.mapForm.get("cityname").value,
        this.mapForm.get("shapefileName").value,
        this.mapForm.get("featuresfileName").value
      )
      .subscribe();
  }
}
