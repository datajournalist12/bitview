import { Component, ViewChild, OnInit, AfterViewInit } from "@angular/core";
import { HttpService } from "./http.service";
import { firstValueFrom, lastValueFrom, Observable, Subscription } from "rxjs";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexFill,
  ApexMarkers,
  ApexYAxis,
  ApexXAxis,
  ApexTooltip
} from "ng-apexcharts";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  public series: ApexAxisChartSeries;
  public chart: ApexChart;
  public dataLabels: ApexDataLabels;
  public markers: ApexMarkers;
  public title: ApexTitleSubtitle;
  public fill: ApexFill;
  public yaxis: ApexYAxis;
  public xaxis: ApexXAxis;
  public tooltip: ApexTooltip;

  constructor(private _http: HttpService) {
  }

  public initChartData(): void {
    let ts2 = 1484418600000;
    let dates = [];
    for (let i = 0; i < 120; i++) {
      ts2 = ts2 + 86400000;
      dates.push([ts2, this.dividedByArray]); //dataSeries[1][i].value]
    }

    this.series = [
      {
        name: "XYZ MOTORS",
        data: dates
      }
    ];
    this.chart = {
      type: "area",
      stacked: false,
      height: 350,
      zoom: {
        type: "x",
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: "zoom"
      }
    };
    this.dataLabels = {
      enabled: false
    };
    this.markers = {
      size: 0
    };
    this.title = {
      text: "Stock Price Movement",
      align: "left"
    };
    this.fill = {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100]
      }
    };
    this.yaxis = {
      labels: {
        formatter: function(val) {
          return (val / 1000000).toFixed(0);
        }
      },
      title: {
        text: "Price"
      }
    };
    this.xaxis = {
      type: "datetime"
    };
    this.tooltip = {
      shared: false,
      y: {
        formatter: function(val) {
          return (val / 1000000).toFixed(0);
        }
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

  ngAfterViewInit() {
    this.initChartData();
  }

  
}
