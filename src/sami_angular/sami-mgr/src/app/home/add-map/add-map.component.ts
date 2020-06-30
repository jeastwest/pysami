import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UtilityService } from "src/app/services/utility.service";
import { Router } from "@angular/router";

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
      .subscribe((response) => {
        console.log(response);
        // need to do error checking here
        this.router.navigateByUrl(`map/:${response.pk}`);
      });
  }
}
