import { Component, OnInit } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';
import { ThemePalette } from '@angular/material/core';
import { MapService } from '../services/map.service'
import { MapComponent } from '../map/map.component'

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(public mapService: MapService, public mapComponent: MapComponent) { }
  ngOnInit() {

  }
  public checkvalues() {
    console.log(this.mapService.gradientType)
    console.log(this.mapService.DEFAULT_GRADIENT_THRESHOLD)
  }

}
