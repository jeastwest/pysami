import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

import { UtilityService } from "../services/utility.service";
import { MapService } from "../services/map.service";
import { NgForm } from "@angular/forms";

import { UserMap } from "../models/maps.model";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  loadingSourceMaps: boolean;
  statusMessage: string;

  studyAreaFiles: FileList;

  public maps: any;

  editingMap = false;

  constructor(
    private mapService: MapService,
    private router: Router,
    private utilityService: UtilityService
  ) {}

  ngOnInit(): void {
    this.loadingSourceMaps = true;
    this.statusMessage = "";

    this.getMaps();
  }

  updateAreaFilePath($event): void {
    this.studyAreaFiles = $event.target.files;
  }

  getMaps() {
    this.utilityService.loadMaps().subscribe(
      (maps) => {
        this.maps = maps;
        console.log(this.maps);
      },
      (err) => {
        this.statusMessage = "Error retrieving data";
      },
      () => {
        this.loadingSourceMaps = false;
      }
    );
  }

  onSubmit(f: NgForm) {
    const Name = f.value.name;
    const City = f.value.city;
    const File = this.studyAreaFiles[0].name;
    let result;

    if (this.studyAreaFiles.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (reader.result) {
          this.parseCSV(reader.result);
        }
      };
      reader.readAsText(this.studyAreaFiles[0]);

      this.utilityService.createMap(Name, City, File).subscribe((response) => {
        console.log(response);
        this.getMaps();
      });
    } else {
      console.log("no file selected!");
    }
  }

  parseCSV(file): void {
    console.log("onload result: ", file);
  }

  gotoSelectedMap(id: string) {
    this.router.navigateByUrl("/map/" + id);
  }

  isEditing($event): void {
    this.editingMap = $event;
    if (!this.editingMap) {
      this.getMaps();
    }
  }

  quitForm(): any {
    alert("quitting");
    return;
  }
}
