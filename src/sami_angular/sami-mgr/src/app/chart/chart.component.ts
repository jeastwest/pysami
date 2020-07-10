import { Component } from "@angular/core";
import * as Chart from "chart.js";

import { MapService } from "../services/map.service";

@Component({
  selector: "app-chart",
  templateUrl: "./chart.component.html",
  styleUrls: ["./chart.component.scss"],
})
export class ChartComponent {
  title = "sami-features-chart";
  canvas: any;
  ctx: any;

  constructor(public mapService: MapService) {}

  //   let distance_data = [];
  //   let dispersion_model = [];

  //   // if (tableHazardClick)
  //   if (this.mapService.d === "EXP") {
  //     for (let i = 0; i <= 20; ++i) {
  //       distance_data.push((tableHazardClickIntensity / 10) * i);
  //       disperse = 4.605170186 / tableHazardClickDispersion;
  //       dispersion_model.push(tableHazardClickIntensity * Math.exp(-disperse * (i * 1000)));
  //     }
  //   } else {
  //     for (let i = 0; i <= 20; ++i) {
  //       distance_data.push((tableHazardClickIntensity / 10) * i);
  //       disperse = 0.99 / tableHazardClickDispersion;
  //       dispersion_model.push(Math.max(0, tableHazardClickIntensity * (1 - disperse * (i * 1000))))
  //     }
  //   }

  //   let canvas = document.getElementById('myChart');
  //   let graphData = {
  //     labels: distance_data,
  //     datasets: [
  //       {
  //         label: "Name: " + tableHazardClick + "    Dispersion Type:" + dispersionType,
  //         fill: true,
  //         lineTension: .01,
  //         backgroundColor: "rgba(75,192,192,0.4)",
  //         borderColor: "rgba(75,192,192,1)",
  //         borderDash: [],
  //         borderDashOffset: 0.0,
  //         borderJoinStyle: 'miter',
  //         pointBorderColor: "rgba(75,192,192,1)",
  //         pointBackgroundColor: "#fff",
  //         pointBorderWidth: 1,
  //         pointHoverRadius: 5,
  //         pointHoverBackgroundColor: "rgba(75,192,192,1)",
  //         pointHoverBorderColor: "rgba(220,220,220,1)",
  //         pointHoverBorderWidth: 2,
  //         pointRadius: 5,
  //         pointHitRadius: 10,
  //         data: dispersion_model,
  //       }
  //     ]
  //   };

  //   var option = {
  //     showLines: true,
  //     scales: {
  //       xAxes: [{
  //         scaleLabel: {
  //           display: true,
  //           labelString: 'Distance in Meters'
  //         }

  //       }],
  //       yAxes: [{
  //         scaleLabel: {
  //           display: true,
  //           labelString: 'Concentration'
  //         }

  //       }]
  //     },

  //   };
  //   myLineChart = Chart.Line(canvas, {
  //     data: graphData,
  //     options: option
  //   });
  //   // myLineChart.update();
  // }

  //   ngAfterViewInit() {
  //     let distance_data = [];
  //     let dispersion_model = [];
  //     for (let i = 0; i <= 20; ++i) {
  //       distance_data.push((this.tableHazardClickIntensity / 10) * i);
  //       let disperse = 4.605170186 / this.selectedDispersion;
  //       dispersion_model.push(
  //         this.tableHazardClickIntensity * Math.exp(-disperse * (i * 1000))
  //       );
  //     }
  //     // console.log(dispersion_model)

  //     this.canvas = document.getElementById("myChart");
  //     this.ctx = this.canvas.getContext("2d");
  //     let myChart = new Chart(this.ctx, {
  //       type: "line",
  //       data: {
  //         datasets: [
  //           {
  //             label: "Name: " + "test" + "    Dispersion Type:" + "test",
  //             fill: true,
  //             lineTension: 0.01,
  //             backgroundColor: "rgba(75,192,192,0.4)",
  //             borderColor: "rgba(75,192,192,1)",
  //             borderDash: [],
  //             borderDashOffset: 0.0,
  //             borderJoinStyle: "miter",
  //             pointBorderColor: "rgba(75,192,192,1)",
  //             pointBackgroundColor: "#fff",
  //             pointBorderWidth: 1,
  //             pointHoverRadius: 5,
  //             pointHoverBackgroundColor: "rgba(75,192,192,1)",
  //             pointHoverBorderColor: "rgba(220,220,220,1)",
  //             pointHoverBorderWidth: 2,
  //             pointRadius: 5,
  //             pointHitRadius: 10,
  //             data: dispersion_model,
  //           },
  //         ],
  //       },
  //       options: {
  //         display: true,
  //         showLines: true,
  //         scales: {
  //           xAxes: [
  //             {
  //               scaleLabel: {
  //                 display: true,
  //                 labelString: "Distance in Meters",
  //               },
  //             },
  //           ],
  //           yAxes: [
  //             {
  //               scaleLabel: {
  //                 display: true,
  //                 labelString: "Concentration",
  //               },
  //             },
  //           ],
  //         },
  //       },
  //     });
  //   }
  // }

  // ngAfterViewInit(): any {
  //   this.canvas = document.getElementById('myChart');
  //   this.ctx = this.canvas.getContext('2d');

  //   let distance_data = [];
  //   let dispersion_model = [];
  //   let tableHazardClickIntensity = 10000;
  //   let selectedDispersion = 2000;
  //   // if (tableHazardClick)
  //   // if (this.mapService === "EXP") {
  //   for (let i = 0; i <= 20; ++i) {
  //     distance_data.push((tableHazardClickIntensity / 10) * i);
  //     let disperse = 4.605170186 / selectedDispersion;
  //     dispersion_model.push(tableHazardClickIntensity * Math.exp(-disperse * (i * 1000)));
  //     // }
  //     // } else {
  //     //   for (let i = 0; i <= 20; ++i) {
  //     //     distance_data.push((tableHazardClickIntensity / 10) * i);
  //     //     disperse = 0.99 / tableHazardClickDispersion;
  //     //     dispersion_model.push(Math.max(0, tableHazardClickIntensity * (1 - disperse * (i * 1000))))
  //     //   }
  //     // }

  //     let graphData = {
  //       labels: "test",
  //       datasets: [
  //         {
  //           label: "Name: " + "test" + "    Dispersion Type:" + "test",
  //           fill: true,
  //           lineTension: .01,
  //           backgroundColor: "rgba(75,192,192,0.4)",
  //           borderColor: "rgba(75,192,192,1)",
  //           borderDash: [],
  //           borderDashOffset: 0.0,
  //           borderJoinStyle: 'miter',
  //           pointBorderColor: "rgba(75,192,192,1)",
  //           pointBackgroundColor: "#fff",
  //           pointBorderWidth: 1,
  //           pointHoverRadius: 5,
  //           pointHoverBackgroundColor: "rgba(75,192,192,1)",
  //           pointHoverBorderColor: "rgba(220,220,220,1)",
  //           pointHoverBorderWidth: 2,
  //           pointRadius: 5,
  //           pointHitRadius: 10,
  //           data: dispersion_model,
  //         }
  //       ]
  //     };

  //     var option = {
  //       showLines: true,
  //       scales: {
  //         xAxes: [{
  //           scaleLabel: {
  //             display: true,
  //             labelString: 'Distance in Meters'
  //           }

  //         }],
  //         yAxes: [{
  //           scaleLabel: {
  //             display: true,
  //             labelString: 'Concentration'
  //           }

  //         }]
  //       },

  //     };
  //     let myChart = new Chart(this.ctx, {
  //       type: 'line',
  //       data: graphData,
  //       options: option
  //     });
  //     myChart.update();
  //   }
}
