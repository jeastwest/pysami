import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopUpService {

  constructor() { }

  makeSourcePopup(data: any): string {
    return `` +
      `<div>Type: ${data.properties.Type}</div>` +
      `<div>Name: ${data.properties.NAME}</div>`
  }
}
