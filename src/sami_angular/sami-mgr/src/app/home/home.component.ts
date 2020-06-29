import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { UtilityService } from "../services/utility.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  statusMessage: string;
  loadingUserMaps: boolean;
  studyAreaFiles: FileList;

  maps: any;

  addingMap = false;

  constructor(private router: Router, private utilityService: UtilityService) {}

  ngOnInit(): void {
    this.statusMessage = "";
    this.loadingUserMaps = false;
    this.getMaps();
  }

  getMaps() {
    this.utilityService.loadMaps().subscribe(
      (maps) => {
        this.maps = maps;
      },
      (err) => {
        this.statusMessage = "Error retrieving data";
      },
      () => {
        this.loadingUserMaps = false;
      }
    );
  }

  addMap(): void {
    console.log("add new map, not yet implemented!");
    this.addingMap = true;
  }

  deleteMap(id): void {
    console.log(`delete map ${id}, not yet implemented!`);
  }

  gotoSelectedMap(id: string) {
    this.router.navigateByUrl("/map/" + id);
  }

  isAddingMap($event): void {
    this.addingMap = $event;
    if (!this.addingMap) {
      this.getMaps();
    }
  }

  cancel(): void {
    this.addingMap = false;
  }
}
