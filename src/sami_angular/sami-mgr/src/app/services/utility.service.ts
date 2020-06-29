import { Injectable } from "@angular/core";
import { Observable, throwError, of } from "rxjs";
import { timeout, catchError, tap } from "rxjs/operators";
import { filter } from "rxjs/operators";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";

import { UserMap } from "../models/maps.model";
import { Source } from "../models/sources.model";

import { AuthService } from "./auth.service";

import * as L from "leaflet";
import * as turf from "@turf/turf";
import * as d3 from "d3";

@Injectable({
  providedIn: "root",
})
export class UtilityService {
  public myMaps: UserMap[] = [];
  public sources: Source[] = [];
  constructor(private auth: AuthService, public http: HttpClient) {}

  // build custom icons
  public hazmatIcon = L.icon({
    iconUrl: "./icons/hazmat.png",
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });

  // helper function to convert a turf.js bounding box to a leaflet.js bounds object
  turfBBoxToLeafletBounds(turf_bbox) {
    /* turf-bbox : lng, lat, lng, lat
         leaflet-latlng: lat, lng
         leaflet-latlngBounds: leaflet-latlng, leaflet-latlng    
      */
    const corner1 = L.latLng(turf_bbox[1], turf_bbox[0]);
    const corner2 = L.latLng(turf_bbox[3], turf_bbox[2]);
    return L.latLngBounds(corner1, corner2);
  }

  // function to flip lat/lng pair arrays
  flipCoords(coords) {
    console.log(coords);
    return [coords[1], coords[0]];
  }

  // returns array of cells that have atleast one corner within study area
  // UPDATE - this function is garbage, too many cases where none of the referenced points
  // are wihin the area polygon, but the cell should be included,
  // need to change this to a crossing-line sort of algorithm
  public getCellsWithinStudyArea(cells, studyArea) {
    let result = [];
    for (let cell of cells) {
      for (let corner of cell.corners) {
        if (
          turf.booleanPointInPolygon(
            turf.point(corner),
            studyArea.features[0].geometry
          )
        ) {
          result.push(cell);
          break;
        }
      }
    }
    return result;
  }

  // function to determine if a point is within a cell defined by a centroid
  isContainedWithinCell(hazardPoint, centerPoint, cellSize) {
    const halfCellSizeInDegrees = turf.lengthToDegrees(cellSize, "meters") / 2;
    if (
      // TODO:
      // this can be improved, edge cases currently could return true for two adjoining cells
      // if the point is equidistant to both centroids.
      // leaving out the = could cause valid matches to return false?
      hazardPoint.lat <= centerPoint[1] + halfCellSizeInDegrees &&
      hazardPoint.lat >= centerPoint[1] - halfCellSizeInDegrees &&
      hazardPoint.lng <= centerPoint[0] + halfCellSizeInDegrees &&
      hazardPoint.lng >= centerPoint[0] - halfCellSizeInDegrees
    ) {
      return true;
    }
    return false;
  }

  // function that takes two lat/lng pairs and returns the distance squared in meters
  degreesToLengthDistanceSquared(point1, point2) {
    const _x1 = turf.radiansToLength(turf.degreesToRadians(point1[0]));
    const _x2 = turf.radiansToLength(turf.degreesToRadians(point2[0]));
    const _y1 = turf.radiansToLength(turf.degreesToRadians(point1[1]));
    const _y2 = turf.radiansToLength(turf.degreesToRadians(point2[1]));

    const _x = _x1 - _x2;
    const _y = _y1 - _y2;

    return _x * _x + _y * _y;
  }

  calculateExponentialDisperdionDistance(intensity) {
    return null;
  }

  calculateLinearDispersionDistance(intensity) {
    return null;
  }

  createMarker(feature) {
    let marker = L.circleMarker(
      { lng: feature.Longitude, lat: feature.Latitude },
      {
        radius: 6,
        fillColor: "yellow",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
        zIndexOffset: 999999999999,
      }
    );

    marker.bindTooltip(
      "Intensity: " +
        feature.Intensity +
        "<br>Dispersion: " +
        feature.Dispersion +
        "<br>Name: " +
        feature.Name
    );
    // '<br>Added By: ' + feature.Map); // unused map-source verification
    return marker;
  }

  loadMaps(): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.auth.getAuthToken(),
        "Content-Type": "application/json",
      }),
    };
    return this.http.get<any>(environment.apiUrl + "api/maps/", options).pipe(
      timeout(5000),
      tap((myMaps) => {
        if (myMaps) {
          this.myMaps = [...myMaps];
        }
      }),
      catchError((err) => {
        return of({ error: "failed to retrieve maps!" });
      })
    );
  }

  // POST/api/map/ - endpoint that allows registration of new maps
  // required params - map name, city
  // No authentication required
  createMap(Name: string, City: string, Study_area: string): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.auth.getAuthToken(),
        "Content-Type": "application/json",
      }),
    };
    let newMap = {
      Name,
      City,
      Study_area,
    };
    return this.http
      .post<any>(environment.apiUrl + "api/maps/", newMap, options)
      .pipe(
        // timeout(10000),
        catchError((err) => {
          return of({ error: "failed to add map" });
        })
      );
  }

  getSelectedMapSources(map_id: string): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.auth.getAuthToken(),
        "Content-Type": "application/json",
      }),
    };
    return this.http
      .get<any>(environment.apiUrl + "api/sources/" + map_id + "/", options)
      .pipe(
        // timeout(5000),
        tap((response) => {
          this.sources = [...response];
          console.log(this.sources);
        }),
        catchError((err) => {
          return of({ error: "failed to retrieve table values!" });
        })
      );
  }

  // getMapTableValues(): Observable<any> {
  //   return this.http.get<Source[]>(environment.apiUrl + 'sources/', this.httpOptions).pipe(
  //     timeout(5000),
  //     tap(sources => {
  //       if (sources) {
  //         this.sources = [...sources];

  //       }
  //     }),
  //     catchError(err => {
  //       return of({ error: "failed to retrieve table values!" });
  //     })
  //   )
  // }

  addNewSource(
    Map: string,
    Latitude: number,
    Longitude: number,
    Description: string,
    Intensity: number,
    Dispersion: number,
    Name: string
  ): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.auth.getAuthToken(),
        "Content-Type": "application/json",
      }),
    };
    const newSource = {
      Map,
      Longitude,
      Latitude,
      Description,
      Intensity,
      Dispersion,
      Name,
    };
    return this.http
      .post(environment.apiUrl + "api/sources/" + Map + "/", newSource, options)
      .pipe(
        timeout(5000),
        tap((response: any) => {
          console.log("response from /sources " + response);
        }),
        catchError((err) => {
          return of({ error: "failed to add new source!" });
        })
      );
  }
}

// loads local shape file and initializes a new studyArea
// handleUpload() {
//   const file = document.getElementById('inputFeatureFile').files[0];
//   if (file) {
//     const reader = new FileReader();
//     reader.onload = function () {
//       if (reader.result) {
//         result = JSON.parse(reader.result);
//         activeStudyArea = initializNewStudyArea(result);
//         activeStudyArea.areaLayer.addTo(map);
//         map.flyToBounds(turfBBoxToLeafletBounds(activeStudyArea.bbox));
//       }
//     };
//     reader.readAsBinaryString(file);
//   } else {
//     console.log('no file selected!');
//   }
// }
