import { Component, ViewChild, OnInit } from "@angular/core";
import { HttpService } from "./http.service";
import { firstValueFrom, lastValueFrom, Observable, Subscription } from "rxjs";

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor(private _http: HttpService) {
    this.chartOptions = {
      series: [
        {
          name: "Desktops",
          data: [0, 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225, 256, 289, 324, 361, 400, 441, 484, 529, 576, 625, 676, 729, 784, 841, 900, 961, 1024, 1089, 1156, 1225, 1296, 1369, 1444, 1521, 1600, 1681, 1764, 1849, 1936, 2025, 2116, 2209, 2304, 2401]
        }
      ],
      chart: {
        height: 700,
        type: "line",
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      title: {
        text: "Product Trends by Month",
        align: "left"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      xaxis: {
        categories: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49]
      }
    };
  }

  url1: string = "https://api.coingecko.com/api/v3/coins/ethereum/market_chart/range?vs_currency=usd&from=1577836800&to=1646115272";
  url2: string = "https://api.coingecko.com/api/v3/coins/terra-luna/market_chart/range?vs_currency=usd&from=1577836800&to=1646115272"
  dividedByArray: number[] = [];

  async ngOnInit(): Promise<void> {
    let ethJson = await firstValueFrom(this._http.getUrl(this.url1))
    let terraJson = await firstValueFrom(this._http.getUrl(this.url2))

    console.log(ethJson, terraJson)
    console.log({Value: ethJson['prices'][20][1]})

    for (let i = 0; i < ethJson['prices'].length; i++) {
      // console.log(terraJson['prices'][i][1]/ethJson['prices'][i][1])
      this.dividedByArray.push(terraJson['prices'][i][1]/ethJson['prices'][i][1])
    }

    console.log(this.dividedByArray)
  }

  
}
