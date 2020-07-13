import { Component, OnInit } from "@angular/core";
import { UploaderService } from "../services/uploader.service";
import { MapService } from "../services/map.service";
import { stringify } from "querystring";

@Component({
  selector: "app-upload",
  templateUrl: "./upload.component.html",
  styleUrls: ["./upload.component.scss"],
})
export class UploadComponent implements OnInit {
  numValsInRecord: number;
  files: FileList;
  rejectedSources = [];

  constructor(
    private uploaderService: UploaderService,
    private mapService: MapService
  ) {}

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
    const map_id = this.mapService.getActiveMap().id;

    const lines = file.split("\n");
    for (const line in lines) {
      let source = this.parseSource(lines[line]);
      if (source) {
        const s = { map_id: map_id, ...source };
        sources.push(s);
      } else {
        this.rejectedSources.push({ invalidRecord: lines[line] });
      }
    }
    if (sources.length > 0) {
      this.batchLoadSources(sources);
    }
    if (this.rejectedSources.length > 0) {
      // console.log("invalid records: ", this.rejectedSources);
    }
  }

  parseSource(line) {
    const source = line.split(",");
    if (source.length === 6) {
      const lat = parseFloat(source[0].trim());
      if (!lat || typeof lat !== "number") {
        return null;
      }
      const lng = parseFloat(source[1].trim());
      if (!lng || typeof lng !== "number") {
        return null;
      }
      let sourceType = source[2].trim();
      if (typeof sourceType !== "string") {
        return null;
      } else if (sourceType.length === 0) {
        sourceType = "unknown";
      }
      const intensity = parseInt(source[3].trim());
      if (!intensity || typeof intensity !== "number") {
        return null;
      }
      const dispersion = parseInt(source[4].trim());
      if (!dispersion || typeof dispersion !== "number") {
        return null;
      }
      let name = source[5].trim();
      if (typeof name !== "string") {
        return null;
      } else if (name.length === 0) {
        name = "unknown";
      }
      return {
        lat,
        lng,
        sourceType,
        intensity,
        dispersion,
        name,
      };
    }
    return null;
  }

  // expects an array of source objects
  // very crude batch loading function, no load control or throttling
  // big files might break things
  // tested with 200+ sources loading and updating the heatmaps in ~8sec.
  batchLoadSources(sources) {
    const map = this.mapService.getActiveMap();
    let submitted = 0;
    let completed = 0;
    while (submitted < sources.length) {
      this.uploaderService.addSource(sources[submitted]).subscribe(() => {
        completed++;
        if (completed >= sources.length) {
          this.mapService.getActiveMapSources(map.id).subscribe(() => {
            this.mapService.updateHeatmaps(map.studyArea);
            this.mapService.buildHeatmapLayers(map.studyArea);
            this.mapService.addLocationsToMap(map.studyArea);
          });
        }
      });
      submitted++;
    }
  }
}
