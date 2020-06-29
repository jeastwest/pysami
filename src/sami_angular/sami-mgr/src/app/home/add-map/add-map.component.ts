import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-add-map",
  templateUrl: "./add-map.component.html",
  styleUrls: ["./add-map.component.scss"],
})
export class AddMapComponent implements OnInit {
  mapForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.mapForm = this.fb.group({
      mapname: [null, Validators.required],
      cityname: [null, Validators.required],
      shapefileName: [null, Validators.required],
      featuresfileName: [null, Validators.required],
    });
  }
  // onSubmit(f: NgForm) {
  //   const Name = f.value.name;
  //   const City = f.value.city;
  //   const File = this.studyAreaFiles[0].name;
  //   let result;

  //   if (this.studyAreaFiles.length > 0) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       if (reader.result) {
  //         this.parseCSV(reader.result);
  //       }
  //     };
  //     reader.readAsText(this.studyAreaFiles[0]);

  //     this.utilityService.createMap(Name, City, File).subscribe((response) => {
  //       console.log(response);
  //       this.getMaps();
  //     });
  //   } else {
  //     console.log("no file selected!");
  //   }
  // }

  // updateAreaFilePath($event): void {
  //   this.studyAreaFiles = $event.target.files;
  // }

  // parseCSV(file): void {
  //   console.log("onload result: ", file);
  // }

  // quitForm(): any {
  //   alert("quitting");
  //   return;
  // }
}
