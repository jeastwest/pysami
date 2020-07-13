import { Component, OnInit } from "@angular/core";
import { MapService } from "../services/map.service";

@Component({
  selector: "app-table",
  styleUrls: ["table.component.scss"],
  templateUrl: "table.component.html",
})
export class TableComponent implements OnInit {
  displayedColumns = ["Name", "SourceType", "Intensity", "Dispersion"];

  sourceData;

  constructor(private mapService: MapService) {}

  ngOnInit() {
    this.sourceData = this.mapService.getSources();
  }

  applyFilter(event: Event) {
    console.log("table filtering not yet implemented");
  }
}
