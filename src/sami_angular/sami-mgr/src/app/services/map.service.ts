import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";

import { Observable, throwError, of } from "rxjs";
import { timeout, catchError, tap } from "rxjs/operators";

import { AuthService } from '../services/auth.service'
import { UtilityService } from '../services/utility.service'
import { StudyAreaService } from '../services/study-area.service'
import { FormComponent } from '../form/form.component'


import * as L from 'leaflet'
import * as turf from '@turf/turf'
import * as d3 from 'd3'
import { UserMap } from '../models/maps.model';
import { Source } from '../models/sources.model'

@Injectable({
  providedIn: 'root'
})
export class MapService {
  @Output() registeringSource = new EventEmitter<boolean>();
  waitingForResponse: boolean;
  errorMessage: string;

  public map: any;
  sources: Source[];
  public map_id: string;
  public layerControls;

  public appVersion = '0.5.0';

  //variables used throughout map
  public COORD_OPTIONS: any = { units: 'meters' };

  public DEFAULT_CELL_SIZE = 300; // size of raster cell in meters
  public DEFAULT_INTENSITY_COLOR = '#000000'; //  this is for the calculateColor() default
  public MIN_INTENSITY_COLOR = '#d3d3d3';
  public MIN_INTENSITY_THRESHOLD = 0.01;

  public DEFAULT_GRADIENT_THRESHOLD = 10000;
  public DEFAULT_CELL_OPACITY = 0.5;

  // gradientTypes - ['relative', 'absolute']
  public DEFAULT_GRADIENT = 'relative';

  // dispersionTypes - ['exponential', 'linear']
  public DEFAULT_DISPERSION = 'exponential';

  public DISPERSION_EXP = Math.log(100);
  public DISPERSION_LIN = 0.99;

  public maxIntensity = [];

  public cellSize = this.DEFAULT_CELL_SIZE;
  public gradientType = this.DEFAULT_GRADIENT;
  public gradientThreshold = this.DEFAULT_GRADIENT_THRESHOLD;
  public dispersionType = this.DEFAULT_DISPERSION;

  // for development purposes/to auto-load houston set to true
  houstonIsDefault = true;
  // draw debug info
  debug = false;

  activeStudyArea: any = {}; // this object represents a study area and contains all its data
  studyAreas: any = []; // this will hold any generated study areas
  heatmap_lin: any;



  constructor(private http: HttpClient, private utilityService: UtilityService, private studyAreaService: StudyAreaService, private auth: AuthService) { }

  initMap(): void {
    this.map = L.map('map', {
      center: [39.8283, -98.5795],
      crs: L.CRS.EPSG3857,
      zoom: 4,
      zoomControl: true,
      preferCanvas: true,
      visualClickEvents: 'click contextmenu',
      renderer: L.canvas() // <-- adding this doesn't seem to make much difference in performance
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    // Map tile sets
    const OpenStreetMap_Map = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    const OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    tiles.addTo(this.map);

    const CartoDB_Voyager = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution:
        '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd'
    });

    const mapLayers = {
      OpenStreetMap: OpenStreetMap_Map,
      OpenTopoMap: OpenTopoMap,
      'Thunderforest Transport': CartoDB_Voyager
    };
    this.layerControls = L.control.layers(mapLayers).addTo(this.map);

    L.control.scale().addTo(this.map);

    L.control.fullscreen({ forceSeparateButton: false, position: 'topleft', title: 'Full Screen', titleCancel: 'Exit Full Screen' }).addTo(this.map);

    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = (map) => {
      var div = L.DomUtil.create('div', 'legend-info legend'),
        grades = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        labels = ['<h4>% Maximum</h4>'],
        from,
        to;

      for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push('<i style="background:' + d3.interpolateReds(from + 0.01) + '"></i>' + from + (to ? ' &ndash; ' + to : '+'));
      }

      div.innerHTML = labels.join('<br>');
      return div;
    };
    legend.addTo(this.map);



  }


  updateLayers(map_id: string) {
    console.log(this.layerControls)
    const layers = this.layerControls._layers;
    const overlaysToBeRemoved = [];
    for (let layer of layers) {
      console.log(layers)
      if (layer.overlay) {
        overlaysToBeRemoved.push(layer.layer);
      }
    }
    this.updateLayerControls(overlaysToBeRemoved, true);
    this.loadSourceFeatures(this.activeStudyArea, map_id);
  }

  updateLayerControls(layers, r) {
    const remove = r || false;
    for (let layer of layers) {
      let keys = Object.keys(layer);
      if (remove) {
        this.layerControls.removeLayer(layer);
        this.map.removeLayer(layer);
      } else {
        this.layerControls.addOverlay(layer[keys[0]], keys[0]);
      }
    }
  }

  public activateStudyArea(map_id: string) {
    this.studyAreaService.getNolaShape().subscribe(studyAreas => {
      this.studyAreas = studyAreas;
      if (this.houstonIsDefault) {

        this.activeStudyArea = this.initializNewStudyArea(this.studyAreas);
        this.map.flyToBounds(this.utilityService.turfBBoxToLeafletBounds(this.activeStudyArea.bbox));
        this.activeStudyArea.areaLayer.addTo(this.map);

      } else {
        // placeholder for new visitor landing, allows initial loading of a shape file
        // could be a dialog that inputs a shape file and folder path to save user data
        // or even a call to an API
        alert('Welcome to HAMI \n Please load a shapefile of your study area via the display options tab');
      }

      this.loadSourceFeatures(this.activeStudyArea, map_id);
    })
  }




  // Unused highlight feature

  // private highlightFeature(e) {
  //   const layer = e.target;
  //   layer.setStyle({
  //     weight: 10,
  //     opacity: 1.0,
  //     color: '#DFA612',
  //     fillOpacity: 1.0,
  //     fillColor: '#FAE042',
  //   });
  // }

  // private resetFeature(e) {
  //   const layer = e.target;
  //   layer.setStyle({
  //     weight: 3,
  //     opacity: 0.5,
  //     color: '#008f68',
  //     fillOpacity: 0.8,
  //     fillColor: '#6DB65B'
  //   });
  // }

  private initializNewStudyArea(shapeFile) {

    const studyArea: any = {};
    studyArea.name = shapeFile.name;
    studyArea.bbox = turf.bbox(shapeFile); // sets corners of bounding box that contains study area polygon
    studyArea.raster = turf.squareGrid(studyArea.bbox, this.cellSize, this.COORD_OPTIONS); // builds array of cells that fills bounding box
    studyArea.cells = [];
    for (let i = 0; i < studyArea.raster.features.length; i++) {
      studyArea.cells.push({
        center: turf.centroid(studyArea.raster.features[i]).geometry.coordinates,
        corners: studyArea.raster.features[i].geometry.coordinates[0]
      });
    }
    studyArea.cellsWithinStudyArea = this.utilityService.getCellsWithinStudyArea(studyArea.cells, shapeFile);

    studyArea.hazards = []; // studyArea will handle its hazards
    studyArea.heatmaps = {}; // studyArea will handle its heatmaps - a 'heatmap' is an array of values
    studyArea.heatmaps.heatmap_base = null; // heatmap_base includes min and max intensity values in addition to array
    studyArea.heatmaps.heatmap_exp = null; // heatmap_exp and heatmap_lin DO NOT include min and max values as they are same as heatmap_base
    studyArea.heatmaps.heatmap_lin = null;

    // leaflet layer for studyArea polygon
    studyArea.areaLayer = L.geoJSON(shapeFile, {
      style: {
        opacity: 0.5
      }
    });
    // this.studyAreas.push(studyArea);
    return studyArea;


  }

  private loadSourceFeatures(studyArea, map_id) {
    // this is where default data will be added to a studyArea
    // currently fetches saved hazards from the database via GET request
    // can be replaced by any source local or remote
    this.utilityService.getSelectedMapSources(map_id).subscribe((response: any) => {
      console.log(response)
      studyArea.hazards = [...response]

      // add hazards to studyArea object
      // this.handleRegisterResponse(response);
      console.log(studyArea.hazards)
      // everything that is needed to build the heatmaps needs to be loaded by now
      this.hamiReady(studyArea);
      this.addLocationsToMap(studyArea);
    })
  }

  addLocationsToMap(studyArea) {
    const sourceFeatureLayer = L.layerGroup();
    for (const feature of studyArea.hazards) {
      let marker = this.utilityService.createMarker(feature);
      marker.addTo(sourceFeatureLayer);
      feature.marker = marker;
    }
    sourceFeatureLayer.addTo(this.map);
    // updateSourcesTable(studyArea.hazards);
    this.updateLayerControls([{ 'Source Features': sourceFeatureLayer }], false);
  }

  hamiReady(studyArea) {
    this.updateHeatmaps(studyArea);
    this.buildHeatmapLayers(studyArea);
    if (this.debug) {
      this.drawDebug(studyArea);
    }
  }

  // generates the heatmaps; an array of intensities, used to generate layers/views
  // the heatmap.intensity is parallel to the centroidsWithinStudyArea array
  public updateHeatmaps(studyArea) {
    // studyArea.heatmaps contains the objects:
    // studyArea.heatmaps.heatmap_base is the base heatmap with no dispersion applied
    // studyArea.heatmaps.heatmap_exp is the base heatmap with exponential dispersion applied
    // studyArea.heatmaps.heatmap_lin is the base heatmap with linear dispersion applied

    const hazards = studyArea.hazards;
    const heatmap_base = { intensity: [], max_intensity: Number.MIN_VALUE, min_intensity: Number.MAX_VALUE };
    const heatmap_exp = { intensity: [] };
    const heatmap_lin = { intensity: [] };

    const studyCells = studyArea.cellsWithinStudyArea;

    // initializes heatmaps to same size as centroidsWithinStudyArea
    for (let i = 0; i < studyArea.cellsWithinStudyArea.length; i++) {
      heatmap_base.intensity[i] = 0;
      heatmap_exp.intensity[i] = 0;
      heatmap_lin.intensity[i] = 0;
    }

    // update base heatmap, calculate max and min intensities
    if (hazards.length > 0) {
      for (let j = 0; j < hazards.length; j++) {
        const hazardPoint = { lat: hazards[j].Latitude, lng: hazards[j].Longitude };
        for (let i = 0; i < studyArea.cellsWithinStudyArea.length; i++) {
          const cellCenter = studyArea.cellsWithinStudyArea[i].center;
          if (this.utilityService.isContainedWithinCell(hazardPoint, cellCenter, this.cellSize)) {
            heatmap_base.intensity[i] = heatmap_base.intensity[i] + parseInt(hazards[j].Intensity);
            if (heatmap_base.intensity[i] > heatmap_base.max_intensity) {
              heatmap_base.max_intensity = heatmap_base.intensity[i];
            }
            if (heatmap_base.intensity[i] < heatmap_base.min_intensity) {
              heatmap_base.min_intensity = heatmap_base.intensity[i];
            }
          }
        }
      }
    }
    studyArea.heatmaps.heatmap_base = heatmap_base;

    // calculate exponential heatmap
    for (let i = 0; i < studyCells.length; i++) {
      for (let j = 0; j < hazards.length; j++) {
        const hazard = hazards[j];
        const dispersionFactor = this.DISPERSION_EXP / hazard.Dispersion;
        const distance = turf.distance(
          [studyCells[i].center[0], studyCells[i].center[1]],
          [hazard.Longitude, hazard.Latitude],
          this.COORD_OPTIONS
        );
        const dispersedIntensity = hazard.Intensity * Math.exp(-dispersionFactor * distance);
        heatmap_exp.intensity[i] += dispersedIntensity;
      }
    }
    studyArea.heatmaps.heatmap_exp = heatmap_exp;

    // calculate linear heatmap
    for (let i = 0; i < studyCells.length; i++) {
      for (let j = 0; j < hazards.length; j++) {
        const hazard = hazards[j];
        const dispersionFactor = this.DISPERSION_LIN / hazard.Dispersion;
        heatmap_lin.intensity[i] += Math.max(
          0,
          hazard.Intensity * (1 - dispersionFactor * turf.distance(studyCells[i].center, [hazard.Longitude, hazard.Latitude], this.COORD_OPTIONS))
        );
      }
    }
    studyArea.heatmaps.heatmap_lin = heatmap_lin;
  }


  public buildHeatmapLayers(studyArea) {
    const maxIntensity = 50000;
    console.log(maxIntensity)
    let heatmap_exp = studyArea.heatmaps.heatmap_exp;
    const heatmapExpLayer = L.layerGroup();
    for (let i = 0; i < studyArea.cellsWithinStudyArea.length; i++) {
      const cell = studyArea.cellsWithinStudyArea[i];
      const intensity = heatmap_exp.intensity[i];

      if (intensity > maxIntensity * this.MIN_INTENSITY_THRESHOLD) {
        // const cellColor = this.getCellColor(intensity / maxIntensity);
        const cellColor = this.calculateCellColor(intensity, maxIntensity, null, this.gradientType);
        const c = L.rectangle(
          [
            [cell.corners[0][1], cell.corners[0][0]],
            [cell.corners[2][1], cell.corners[2][0]]
          ],
          {
            fillColor: cellColor,
            weight: 0.0, // weight is 0 so the borders of the cells aren't drawn
            fillOpacity: this.DEFAULT_CELL_OPACITY
          }
        );
        c.bindTooltip('Intensity: ' + Math.floor(intensity));
        c.addTo(heatmapExpLayer);
      }
    }
    heatmap_exp.heatmapLayer = heatmapExpLayer;
    heatmap_exp.heatmapLayer.addTo(this.map);

    this.heatmap_lin = studyArea.heatmaps.heatmap_lin;
    const heatmapLinLayer = L.layerGroup();
    for (let i = 0; i < studyArea.cellsWithinStudyArea.length; i++) {
      const cell = studyArea.cellsWithinStudyArea[i];
      const intensity = this.heatmap_lin.intensity[i];

      if (intensity > maxIntensity * this.MIN_INTENSITY_THRESHOLD) {
        // const cellColor = this.getCellColor(intensity / maxIntensity);
        const cellColor = this.calculateCellColor(intensity, maxIntensity, null, this.gradientType);
        const c = L.rectangle(
          [
            [cell.corners[0][1], cell.corners[0][0]],
            [cell.corners[2][1], cell.corners[2][0]]
          ],
          {
            fillColor: cellColor,
            weight: 0.0, // weight is 0 so the borders of the cells aren't drawn
            fillOpacity: this.DEFAULT_CELL_OPACITY
          }
        );
        c.bindTooltip('Intensity: ' + Math.floor(intensity));
        c.addTo(heatmapLinLayer);
      }
    }
    this.heatmap_lin.heatmapLayer = heatmapLinLayer;

    this.updateLayerControls([{ 'Exponential Heatmap': heatmapExpLayer }, { 'Linear Heatmap': heatmapLinLayer }], false);
  }
  drawDebug(studyArea) {
    // draw area bounding box
    L.rectangle(this.utilityService.turfBBoxToLeafletBounds(studyArea.bbox), { color: '#0000ff', weight: 1, fillOpacity: 0.0 }).addTo(this.map);
  }


  public calculateCellColor(intensity, max_intensity, threshold, gradientType) {
    this.gradientThreshold = threshold ? threshold : this.DEFAULT_GRADIENT_THRESHOLD;
    let colorIntensity = 0;
    switch (gradientType) {
      case 'relative':
        colorIntensity = intensity / max_intensity;
        if (colorIntensity < this.MIN_INTENSITY_THRESHOLD) {
          return this.MIN_INTENSITY_COLOR;
        } else {
          return d3.interpolateReds(colorIntensity);
        }
      case 'absolute':
        colorIntensity = (Math.log10(intensity) - Math.log10(this.gradientThreshold) + 3) / 6; // 3 & 6 are used to translate log value to 0-1; INTENSITY_LOG_RANGE?
        if (colorIntensity < this.MIN_INTENSITY_THRESHOLD) {
          return this.MIN_INTENSITY_COLOR;
        } else {
          return d3.interpolateReds(colorIntensity);
        }
      default:
        return this.DEFAULT_INTENSITY_COLOR;
    }
  }

  registerSource(
    map_id: string,
    lat: number,
    lng: number,
    description: string,
    intensity: number,
    dispersion: number,
    name: string
  ) {
    this.waitingForResponse = true;
    this.errorMessage = "";
    this.utilityService
      .addNewSource(
        map_id,
        lat,
        lng,
        description,
        intensity,
        dispersion,
        name
      )
      .subscribe(response => {
        this.handleRegisterResponse(response);
      });
  }

  handleRegisterResponse(response): void {
    // this endpoint returns null on success
    this.waitingForResponse = false;
    if (response) {
      if (response.error) {
        this.errorMessage = response.error;
      } else {
        this.cancel();
      }
    } else {
      this.cancel();
    }
  }
  cancel(): void {
    this.registeringSource.emit(false);
  }

  getCellColor(intensity) {
    return d3.interpolateReds(intensity);
  }


}
