import { Component, OnInit } from "@angular/core";
import { UploaderService } from "../services/uploader.service";

@Component({
  selector: "app-upload",
  templateUrl: "./upload.component.html",
  styleUrls: ["./upload.component.scss"],
})
export class UploadComponent implements OnInit {
  numValsInRecord: number;
  files: FileList;
  rejectedSources = [];

  constructor(private uploaderService: UploaderService) {}

  ngOnInit() {}

  updateFileList(event): void {
    this.files = event.target.files;
  }

  uploadSourceFile(): void {
    this.rejectedSources = [];
    if (this.files.length === 0) {
      console.log("no files selected!");
      return;
    }
    for (let f = 0; f < this.files.length; f++) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (reader.result) {
          this.readCSV(reader.result);
        } else {
          // error here?
        }
      };
      reader.readAsText(this.files[f]);
    }
  }

  readCSV(file) {
    const sources = [];

    const lines = file.split("\n");
    for (const line in lines) {
      const source = this.parseSource(lines[line]);
      if (source) {
        sources.push(source);
      } else {
        this.rejectedSources.push({ invalidRecord: lines[line] });
      }
    }
    if (sources.length > 0) {
      this.uploaderService.batchLoadSources(sources);
    }
    if (this.rejectedSources.length > 0) {
      console.log("invalid records: ", this.rejectedSources);
    }
  }

  parseSource(line) {
    const result = null;
    const source = line.split(",");
    if (source.length === 4) {
      const name = source[1];
      if (typeof name !== "string") {
        return result;
      }
      const sourceType = source[0];
      if (typeof sourceType !== "string") {
        return result;
      }
      const intensity = parseInt(source[2]);
      if (!intensity || typeof intensity !== "number") {
        return result;
      }
      const dispersion = parseInt(source[3]);
      if (!dispersion || typeof dispersion !== "number") {
        return result;
      }
      return {
        name,
        sourceType,
        intensity,
        dispersion,
      };
    }
    return result;
  }
}
