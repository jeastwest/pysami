import { Injectable, ComponentFactoryResolver, Injector } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable, of } from "rxjs";
import { timeout, catchError, tap } from "rxjs/operators";

import * as L from "leaflet";
import "node_modules/leaflet.fullscreen/Control.FullScreen.js";
import * as turf from "@turf/turf";
import * as d3 from "d3";

import { environment } from "src/environments/environment";

import { AuthService } from "../services/auth.service";
import { UtilityService } from "../services/utility.service";

import { Source } from "../models/sources.model";
import { FormComponent } from "../form/form.component";

@Injectable({
  providedIn: "root",
})
export class MapService {
  // leaflet map
  map: any;
  sources: Source[];
  map_id: string;
  layerControls;

  appVersion = "0.5.0";

  //variables used throughout map
  COORD_OPTIONS: any = { units: "meters" };

  DEFAULT_CELL_SIZE = 300; // size of raster cell in meters
  DEFAULT_INTENSITY_COLOR = "#000000"; //  this is for the calculateColor() default
  MIN_INTENSITY_COLOR = "#d3d3d3";
  MIN_INTENSITY_THRESHOLD = 0.01;

  DEFAULT_ABS_GRADIENT_THRESHOLD = 10000;
  DEFAULT_CELL_OPACITY = 0.5;

  // gradientTypes - ['relative', 'absolute']
  DEFAULT_GRADIENT = "relative";

  // dispersionTypes - ['exponential', 'linear']
  DEFAULT_DISPERSION = "exponential";

  DISPERSION_EXP = Math.log(100);
  DISPERSION_LIN = 0.99;

  maxIntensity = [];

  cellSize = this.DEFAULT_CELL_SIZE;
  gradientType = this.DEFAULT_GRADIENT;
  absGradientThreshold = this.DEFAULT_ABS_GRADIENT_THRESHOLD;
  dispersionType = this.DEFAULT_DISPERSION;

  maps = [];
  activeMap = null;

  activeStudyArea = null; // this object represents a study area and contains all its data
  studyAreas = [];

  private defaultMap = {
    mapID: 0,
    mapName: "map-name",
    area: "city-name",
    shapeFile: "//path/to/shapefile.shp",
    shapeFileData: {},
    featuresFile: "//path/to/featurefile.csv",
    featuresFileData: {},
    studyArea: {},
  };

  private houstonPoly;
  private nolaPoly;

  private addingLocation = false;

  constructor(
    private http: HttpClient,
    private utilityService: UtilityService,
    private auth: AuthService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector
  ) {
    this.getHoustonShape().subscribe((poly) => {
      this.houstonPoly = poly;
    });
    this.getNolaShape().subscribe((poly) => {
      this.nolaPoly = poly;
    });
  }

  ngOnInit() {}

  // builds leaflet map, attaches leaflet ui emelents, and registers map event handlers
  initMap(): void {
    this.map = L.map("map", {
      center: [39.8283, -98.5795],
      crs: L.CRS.EPSG3857,
      zoom: 4,
      zoomControl: true,
      preferCanvas: true,
      visualClickEvents: "click contextmenu",
      renderer: L.canvas(), // <-- adding this doesn't seem to make much difference in performance
    });

    this.map.on("click", (event) => {
      if (this.addingLocation) {
        this.openAddLocationPanel(event);
      }
    });

    // Map tile sets
    const OpenStreetMap_Map = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 19,
        attribution:
          '<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    ).addTo(this.map);

    const OpenTopoMap = L.tileLayer(
      "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 19,
        attribution:
          '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
      }
    );

    const CartoDB_Voyager = L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        maxZoom: 19,
        attribution:
          '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
      }
    );

    const mapLayers = {
      OpenStreetMap: OpenStreetMap_Map,
      OpenTopoMap: OpenTopoMap,
      "Thunderforest Transport": CartoDB_Voyager,
    };
    this.layerControls = L.control.layers(mapLayers).addTo(this.map);

    L.control.scale().addTo(this.map);

    L.control
      .fullscreen({
        forceSeparateButton: false,
        position: "topleft",
        title: "Full Screen",
        titleCancel: "Exit Full Screen",
      })
      .addTo(this.map);

    var legend = L.control({ position: "bottomright" });

    legend.onAdd = (map) => {
      var div = L.DomUtil.create("div", "legend-info legend"),
        grades = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        labels = ["<h4>% Maximum</h4>"],
        from,
        to;

      for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
          '<i style="background:' +
            d3.interpolateReds(from + 0.01) +
            '"></i>' +
            from +
            (to ? " &ndash; " + to : "+")
        );
      }

      div.innerHTML = labels.join("<br>");
      return div;
    };
    legend.addTo(this.map);
  }

  activateMap(mapID) {
    let userMap = this.studyAreas.find((a) => {
      return a.pk === mapID;
    });
    if (!userMap) {
      userMap = this.maps.find((m) => {
        return m.pk === mapID;
      });
      if (userMap) {
        userMap.studyArea = this.initializNewStudyArea(this.houstonPoly);
        this.studyAreas.push({ ...userMap });
      }
    }

    if (userMap) {
      this.activeMap = userMap;
      this.activeStudyArea = this.activeMap.studyArea;
      this.map.flyToBounds(
        this.utilityService.turfBBoxToLeafletBounds(this.activeStudyArea.bbox)
      );
      this.activeStudyArea.areaLayer.addTo(this.map);
      this.getActiveMapSources(mapID);
      this.updateHeatmaps(this.activeStudyArea);
      this.buildHeatmapLayers(this.activeStudyArea);
    } else {
      console.log(`mapID ${mapID} doesn't exist!`);
      console.log(`If you're getting this error from home.compnent`);
      console.log(`I have no idea why, that component shouldn't ever`);
      console.log(`call mapService.activateMap()!!`);
    }
  }

  createMap(
    name: string,
    area: string,
    shapeFile: string,
    featureList: string
  ): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.auth.getAuthToken(),
        "Content-Type": "application/json",
      }),
    };
    // const newMap = { name, area, shapeFile, featureList };
    let newMap = { Name: name, City: area, Study_Area: shapeFile };
    return this.http
      .post<any>(environment.apiUrl + "api/maps/", newMap, options)
      .pipe(
        tap(async () => {
          let userMap = { ...newMap, studyArea: null };
          userMap.studyArea = await this.initializNewStudyArea(
            this.houstonPoly
          );
          this.studyAreas.push({ ...userMap });
        }),
        catchError((err) => {
          return of({ error: "failed to add map" });
        })
      );
  }

  getUserMaps(): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.auth.getAuthToken(),
        "Content-Type": "application/json",
      }),
    };
    return this.http.get<any>(environment.apiUrl + "api/maps/", options).pipe(
      timeout(5000),
      tap((maps) => {
        this.maps = [...maps];
      }),
      catchError((err) => {
        return of({ error: "failed to retrieve maps!" });
      })
    );
  }

  initializNewStudyArea(shapeFile) {
    const studyArea: any = {};
    studyArea.name = shapeFile.name;
    studyArea.bbox = turf.bbox(shapeFile); // sets corners of bounding box that contains study area polygon

    studyArea.raster = turf.squareGrid(
      studyArea.bbox,
      this.cellSize,
      this.COORD_OPTIONS
    ); // builds array of cells that fills bounding box
    studyArea.cells = [];
    for (let i = 0; i < studyArea.raster.features.length; i++) {
      studyArea.cells.push({
        center: turf.centroid(studyArea.raster.features[i]).geometry
          .coordinates,
        corners: studyArea.raster.features[i].geometry.coordinates[0],
      });
    }
    studyArea.cellsWithinStudyArea = this.utilityService.getCellsWithinStudyArea(
      studyArea.cells,
      shapeFile
    );

    studyArea.features = []; // studyArea will handle its source features
    studyArea.heatmaps = {}; // studyArea will handle its heatmaps - a 'heatmap' is an array of values
    studyArea.heatmaps.heatmap_base = null; // heatmap_base includes min and max intensity values in addition to array
    studyArea.heatmaps.heatmap_exp = null; // heatmap_exp and heatmap_lin DO NOT include min and max values as they are same as heatmap_base
    studyArea.heatmaps.heatmap_lin = null;

    // leaflet layer for studyArea polygon
    studyArea.areaLayer = L.geoJSON(shapeFile, {
      style: {
        opacity: 0.5,
      },
    });
    return studyArea;
  }

  getActiveMapSources(mapID: string): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.auth.getAuthToken(),
        "Content-Type": "application/json",
      }),
    };
    return this.http
      .get<any>(environment.apiUrl + "api/sources/" + mapID + "/", options)
      .pipe(
        // timeout(5000),
        tap((response) => {
          this.activeStudyArea.features = [...response];
        }),
        catchError((err) => {
          return of({ error: "failed to retrieve table values!" });
        })
      );
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
    this.updateLayerControls(
      [{ "Source Features": sourceFeatureLayer }],
      false
    );
  }

  // generates the heatmaps; an array of intensities, used to generate layers/views
  // the heatmap.intensity is parallel to the centroidsWithinStudyArea array
  updateHeatmaps(studyArea) {
    // studyArea.heatmaps contains the objects:
    // studyArea.heatmaps.heatmap_base is the base heatmap with no dispersion applied
    // studyArea.heatmaps.heatmap_exp is the base heatmap with exponential dispersion applied
    // studyArea.heatmaps.heatmap_lin is the base heatmap with linear dispersion applied

    const sourceFeatures = studyArea.features;
    const heatmap_base = {
      intensity: [],
      max_intensity: Number.MIN_VALUE,
      min_intensity: Number.MAX_VALUE,
    };
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
    if (sourceFeatures.length > 0) {
      for (let j = 0; j < sourceFeatures.length; j++) {
        const hazardPoint = {
          lat: sourceFeatures[j].Latitude,
          lng: sourceFeatures[j].Longitude,
        };
        for (let i = 0; i < studyArea.cellsWithinStudyArea.length; i++) {
          const cellCenter = studyArea.cellsWithinStudyArea[i].center;
          if (
            this.utilityService.isContainedWithinCell(
              hazardPoint,
              cellCenter,
              this.cellSize
            )
          ) {
            heatmap_base.intensity[i] =
              heatmap_base.intensity[i] + parseInt(sourceFeatures[j].Intensity);
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
      for (let j = 0; j < sourceFeatures.length; j++) {
        const hazard = sourceFeatures[j];
        const dispersionFactor = this.DISPERSION_EXP / hazard.Dispersion;
        const distance = turf.distance(
          [studyCells[i].center[0], studyCells[i].center[1]],
          [hazard.Longitude, hazard.Latitude],
          this.COORD_OPTIONS
        );
        const dispersedIntensity =
          hazard.Intensity * Math.exp(-dispersionFactor * distance);
        heatmap_exp.intensity[i] += dispersedIntensity;
      }
    }
    studyArea.heatmaps.heatmap_exp = heatmap_exp;

    // calculate linear heatmap
    for (let i = 0; i < studyCells.length; i++) {
      for (let j = 0; j < sourceFeatures.length; j++) {
        const hazard = sourceFeatures[j];
        const dispersionFactor = this.DISPERSION_LIN / hazard.Dispersion;
        heatmap_lin.intensity[i] += Math.max(
          0,
          hazard.Intensity *
            (1 -
              dispersionFactor *
                turf.distance(
                  studyCells[i].center,
                  [hazard.Longitude, hazard.Latitude],
                  this.COORD_OPTIONS
                ))
        );
      }
    }
    studyArea.heatmaps.heatmap_lin = heatmap_lin;
  }

  buildHeatmapLayers(studyArea) {
    const heatmap_base = studyArea.heatmaps.heatmap_base;
    const heatmap_exp = studyArea.heatmaps.heatmap_exp;
    const heatmapExpLayer = L.layerGroup();
    for (let i = 0; i < studyArea.cellsWithinStudyArea.length; i++) {
      const cell = studyArea.cellsWithinStudyArea[i];
      const intensity = heatmap_exp.intensity[i];

      if (
        intensity >
        heatmap_base.maxIntensity * this.MIN_INTENSITY_THRESHOLD
      ) {
        // const cellColor = this.getCellColor(intensity / maxIntensity);
        const cellColor = this.calculateCellColor(
          intensity,
          heatmap_base.maxIntensity,
          null,
          this.gradientType
        );
        const c = L.rectangle(
          [
            [cell.corners[0][1], cell.corners[0][0]],
            [cell.corners[2][1], cell.corners[2][0]],
          ],
          {
            fillColor: cellColor,
            weight: 0.0, // weight is 0 so the borders of the cells aren't drawn
            fillOpacity: this.DEFAULT_CELL_OPACITY,
          }
        );
        c.bindTooltip("Intensity: " + Math.floor(intensity));
        c.addTo(heatmapExpLayer);
      }
    }
    heatmap_exp.heatmapLayer = heatmapExpLayer;
    heatmap_exp.heatmapLayer.addTo(this.map);

    const heatmap_lin = studyArea.heatmaps.heatmap_lin;
    const heatmapLinLayer = L.layerGroup();
    for (let i = 0; i < studyArea.cellsWithinStudyArea.length; i++) {
      const cell = studyArea.cellsWithinStudyArea[i];
      const intensity = heatmap_lin.intensity[i];

      if (
        intensity >
        heatmap_base.maxIntensity * this.MIN_INTENSITY_THRESHOLD
      ) {
        // const cellColor = this.getCellColor(intensity / maxIntensity);
        const cellColor = this.calculateCellColor(
          intensity,
          heatmap_base.maxIntensity,
          null,
          this.gradientType
        );
        const c = L.rectangle(
          [
            [cell.corners[0][1], cell.corners[0][0]],
            [cell.corners[2][1], cell.corners[2][0]],
          ],
          {
            fillColor: cellColor,
            weight: 0.0, // weight is 0 so the borders of the cells aren't drawn
            fillOpacity: this.DEFAULT_CELL_OPACITY,
          }
        );
        c.bindTooltip("Intensity: " + Math.floor(intensity));
        c.addTo(heatmapLinLayer);
      }
    }
    heatmap_lin.heatmapLayer = heatmapLinLayer;

    this.updateLayerControls(
      [
        { "Exponential Heatmap": heatmapExpLayer },
        { "Linear Heatmap": heatmapLinLayer },
      ],
      false
    );
  }

  setGradientType(gradient) {
    this.gradientType = gradient;

    // TODO: update heatmaps
  }

  getGradientType() {
    return this.gradientType;
  }

  getDefaultGradient() {
    return this.DEFAULT_GRADIENT;
  }

  setAbsThreshold(threshold) {
    this.absGradientThreshold = threshold;

    // TODO: update heatmaps
  }

  getAbsThreshold() {
    return this.absGradientThreshold;
  }

  setAddingLocation(addingLocation) {
    this.addingLocation = addingLocation;
  }

  openAddLocationPanel(event) {
    const marker = L.marker(event.latlng).addTo(this.map);
    marker.bindPopup(() => this.createCustomPopup()).openPopup();
  }
  private createCustomPopup() {
    const factory = this.componentFactoryResolver.resolveComponentFactory(
      FormComponent
    );
    const component = factory.create(this.injector);

    //Set the component inputs manually
    // component.instance.sourceTypes = this.utilityService.getSourceTypes();
    // component.instance.someinput2 = "example";

    //Subscribe to the components outputs manually (if any)
    // component.instance.someoutput.subscribe(() => console.log("output handler fired"));

    //Manually invoke change detection, automatic wont work, but this is Ok if the component doesn't change
    component.changeDetectorRef.detectChanges();

    return component.location.nativeElement;
  }

  updateLayers(map_id: string) {
    console.log(this.layerControls);
    const layers = this.layerControls._layers;
    const overlaysToBeRemoved = [];
    for (let layer of layers) {
      console.log(layers);
      if (layer.overlay) {
        overlaysToBeRemoved.push(layer.layer);
      }
    }
    this.updateLayerControls(overlaysToBeRemoved, true);
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

  calculateCellColor(intensity, max_intensity, threshold, gradientType) {
    this.absGradientThreshold = threshold
      ? threshold
      : this.DEFAULT_ABS_GRADIENT_THRESHOLD;
    let colorIntensity = 0;
    switch (gradientType) {
      case "relative":
        colorIntensity = intensity / max_intensity;
        if (colorIntensity < this.MIN_INTENSITY_THRESHOLD) {
          return this.MIN_INTENSITY_COLOR;
        } else {
          return d3.interpolateReds(colorIntensity);
        }
      case "absolute":
        colorIntensity =
          (Math.log10(intensity) - Math.log10(this.absGradientThreshold) + 3) /
          6; // 3 & 6 are used to translate log value to 0-1; INTENSITY_LOG_RANGE?
        if (colorIntensity < this.MIN_INTENSITY_THRESHOLD) {
          return this.MIN_INTENSITY_COLOR;
        } else {
          return d3.interpolateReds(colorIntensity);
        }
      default:
        return this.DEFAULT_INTENSITY_COLOR;
    }
  }

  getCellColor(intensity) {
    return d3.interpolateReds(intensity);
  }

  // handleUpload() {
  //   const file = document.getElementById('inputFeatureFile').files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = function () {
  //       if (reader.result) {
  //         result = JSON.parse(reader.result);
  //       }
  //     };
  //   } else {
  //     console.log('no file selected!');
  //   }
  // }

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

  // called by the constructor to pre-load shape files
  getNolaShape(): Observable<any> {
    return this.http.get("../../assets/data/nolaPoly.json");
  }

  getHoustonShape(): Observable<any> {
    return this.http.get("../../assets/data/houstonPoly.json");
  }

  // const iconDefault = L.icon({
  //   iconRetinaUrl,
  //   iconUrl,
  //   shadowUrl,
  //   iconSize: [25, 41],
  //   iconAnchor: [12, 41],
  //   popupAnchor: [1, -34],
  //   tooltipAnchor: [16, -28],
  //   shadowSize: [41, 41],
  // });
  // L.Marker.prototype.options.icon = iconDefault;
}
