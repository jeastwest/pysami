import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserInterfaceService {

  public tableBody
  constructor() { }

  updateSourcesTable(sources) {
    const tableBody = document.getElementById('source-table-body');
    tableBody.innerHTML = '';
    for (let source of sources) {
      tableBody.innerHTML += `
    <tr>
      <td class="info-left" onclick="editSourceValue(event)">${source.Description}</td>
      <td class="info-left" onclick="editSourceValue(event)">${source.Name}</td>
      <td class="info-center" onclick="editSourceValue(event)">${source.Intensity}</td>
      <td class="info-center" onclick="editSourceValue(event)">${source.Dispersion}</td>
    </tr>`;
    }
  }
}
