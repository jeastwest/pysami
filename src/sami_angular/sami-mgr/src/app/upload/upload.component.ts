import { Component } from "@angular/core";
import { UploaderService } from "../services/uploader.service";
import { MapService } from "../services/map.service";

@Component({
  selector: "app-upload",
  templateUrl: "./upload.component.html",
  styleUrls: ["./upload.component.scss"],
})
export class UploadComponent {
  files: FileList;
  sourcesLoaded = 0;
  loadingSources = false;

  constructor(
    private uploaderService: UploaderService,
    private mapService: MapService
  ) {}

  updateFileList(event): void {
    this.files = event.target.files;
  }

  uploadSourceFile(): void {
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
          // error messages here?
        }
      };
      reader.readAsText(this.files[f]);
    }
  }

  readCSV(file) {
    const sources = [];
    const rejectedSources = [];
    const map_id = this.mapService.getActiveMap().id;

    const lines = file.split("\n");
    for (const line in lines) {
      let source = this.parseSource(lines[line]);
      if (source) {
        sources.push({ map_id: map_id, ...source });
      } else {
        rejectedSources.push({ invalidSource: lines[line] });
      }
    }
    if (sources.length > 0) {
      this.batchLoadSources(sources);
    }
    if (rejectedSources.length > 0) {
      // console.log("invalid sources: ", rejectedSources);
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
    this.loadingSources = true;
    const map = this.mapService.getActiveMap();
    let submitted = 0;
    this.sourcesLoaded = 0;

    const requestTimer = setInterval(() => {
      if (submitted < sources.length) {
        this.uploaderService.addSource(sources[submitted]).subscribe(() => {
          this.sourcesLoaded++;
          if (this.sourcesLoaded >= sources.length) {
            this.mapService.updateHeatmapLayers();
            this.loadingSources = false;
          }
        });
        submitted++;
      }
      if (submitted >= sources.length) {
        clearInterval(requestTimer);
      }
    }, 66);
  }
}
