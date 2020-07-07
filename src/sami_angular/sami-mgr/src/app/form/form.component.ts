import { Component } from "@angular/core";

import { UploaderService } from "../services/uploader.service";
import { UtilityService } from "../services/utility.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-form",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.scss"],
})
export class FormComponent {
  sourceForm: FormGroup;
  sourceTypes;

  constructor(
    private uploaderService: UploaderService,
    private utilityService: UtilityService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.sourceForm = this.fb.group({
      name: [null, Validators.required],
      sourceType: [null, Validators.required],
      intensity: [null, Validators.required],
      distance: [null, Validators.required],
    });

    this.sourceTypes = this.utilityService.getSourceTypes();
    console.log("init form!");
  }

  addSource() {
    this.uploaderService.testAddSource();
  }

  quitForm() {}
}
