import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
// import { UtilityService } from '../services/utility.service'
// import { MapComponent } from '../map/map.component'
// import { UserMap } from '../models/maps.model'

@Injectable({
  providedIn: 'root'
})
export class StudyAreaService {
  constructor(private http: HttpClient) { }
  getNolaShape(): Observable<any> {
    return this.http.get('../../assets/data/nola geojson.geojson');
  }

  getHoustonShape(): Observable<any> {
    return this.http.get('../../assets/data/houstonPoly.geojson');
  }

  // getStudyAreaShapes(map_id: any): Observable<any> {
  //   return this.http.get(this.utilityService.getSelectedMapSources(map_id));
  // }





}