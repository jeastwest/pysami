import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { MapService } from "../services/map.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  statusMessage: string;
  studyAreaFiles: FileList;

  maps: any;

  addingMap = false;

  constructor(private router: Router, private mapService: MapService) {}

  ngOnInit(): void {
    this.statusMessage = "";
    this.getMaps();
  }

  addMap(): void {
    this.addingMap = true;
  }

  gotoSelectedMap(id: string) {
    this.router.navigateByUrl(`/map/${id}`);
  }

  getMaps() {
    this.mapService.getUserMaps().subscribe((maps) => {
      this.maps = [...maps];
    });
  }

  isAddingMap($event): void {
    this.addingMap = $event;
    if (!this.addingMap) {
      this.getMaps();
    }
  }

  deleteMap(id): void {
    console.log(`delete map ${id}, not yet implemented!`);
  }

  cancel(): void {
    this.addingMap = false;
  }
}
