import { Component, OnInit } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Source } from '../models/sources.model'
import { UtilityService } from '../services/utility.service'
import { AuthService } from '../services/auth.service';

import { MapComponent } from '../map/map.component'
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";


let SOURCE_DATA: Source[];



@Component({
  selector: 'app-table',
  styleUrls: ['table.component.scss'],
  templateUrl: 'table.component.html',
})
export class TableComponent implements OnInit {


  constructor(private utilityService: UtilityService, private http: HttpClient, private auth: AuthService, private mapComponent: MapComponent, private router: Router,
    private route: ActivatedRoute,
    private location: Location) { }
  dragPosition = { x: 0, y: 0 };

  changePosition() {
    this.dragPosition = { x: this.dragPosition.x + 50, y: this.dragPosition.y + 50 };
  }

  displayedColumns: string[] = ['Description', 'Intensity', 'Dispersion', 'Name'];
  public dataSource;


  ngOnInit(): void {

    const map_id = this.route.snapshot.paramMap.get("id");
    console.log(map_id)
    this.utilityService.getSelectedMapSources(map_id).subscribe(
      (response) => {
        console.log(response)
        SOURCE_DATA = [...response]
        this.dataSource = new MatTableDataSource(SOURCE_DATA);
        console.log(this.dataSource)
      }
    )

  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
