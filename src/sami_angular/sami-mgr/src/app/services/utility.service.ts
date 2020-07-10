import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { UserMap } from "../models/maps.model";
import { Source } from "../models/sources.model";

import * as L from "leaflet";
import * as turf from "@turf/turf";

@Injectable({
  providedIn: "root",
})
export class UtilityService {
  public myMaps: UserMap[] = [];
  public sources: Source[] = [];
  constructor(private http: HttpClient) {}

  SOURCE_TYPES = ["School", "Hospital", "WW Treatment", "Cemetery"];

  // build custom icons
  public hazmatIcon = L.icon({
    iconUrl: "./icons/hazmat.png",
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });

  getSourceTypes() {
    return this.SOURCE_TYPES;
  }

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
          turf.booleanPointInPolygon(turf.point(corner), studyArea.geometry)
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
      { lng: feature.lng, lat: feature.lat },
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
        feature.intensity +
        "<br>Dispersion: " +
        feature.dispersion +
        "<br>Name: " +
        feature.name
    );
    return marker;
  }
}
