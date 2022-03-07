import { Component, ViewChild, OnInit, AfterViewInit, HostListener } from "@angular/core";
import { HttpService } from "./../services/http.service";
import { MessengerService } from "../services/messenger.service";
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
import { ColdObservable } from "rxjs/internal/testing/ColdObservable";

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {

  public series: ApexAxisChartSeries;
  public chart: ApexChart;
  public dataLabels: ApexDataLabels;
  public markers: ApexMarkers;
  public title: ApexTitleSubtitle;
  public fill: ApexFill;
  public yaxis: ApexYAxis;
  public xaxis: ApexXAxis;
  public tooltip: ApexTooltip;

  screenHeight: number;
  screenWidth: number;

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenHeight = window.innerHeight - 100
    this.screenWidth = window.innerWidth;
  }

  constructor(private _http: HttpService, private messageService: MessengerService) {
    this.onResize();
  }

  public initChartData(): void {
    // let ts2 = 1646366078000;
    // let ts1 = ts2 - (791 * 86400000)
    // let dates = [];
    // for (let i = 0; i < 791; i++) {
    //   ts1 = ts1+ 86400000;
    //   dates.push([ts1, this.dividedByArray[i]]);
    // }
    this.series = [
      {
        name: "XYZ MOTORS",
        data: this.final_timeseries
      }
    ];
    this.chart = {
      type: "area",
      stacked: false,
      height: 750,
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
      show: true,
      showAlways: true,
      showForNullSeries: true,
      seriesName: undefined,
      opposite: false,
      reversed: false,
      logarithmic: false,
      logBase: 10,
      tickAmount: 6,
      min: 0,
      max: Math.max(...this.biggest_number),
      forceNiceScale: false,
      floating: false,
      decimalsInFloat: 4,
      labels: {
        show: true,
        align: 'right',
        minWidth: 0,
        maxWidth: 160,
        style: {
          colors: [],
          fontSize: '12px',
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 400,
          cssClass: 'apexcharts-yaxis-label',
        },
        offsetX: 0,
        offsetY: 0,
        rotate: 0,
        // formatter: (value) => { return val },
      },
      axisBorder: {
        show: true,
        color: '#78909C',
        offsetX: 0,
        offsetY: 0
      },
      axisTicks: {
        show: true,
        // borderType: 'solid',
        color: '#78909C',
        width: 6,
        offsetX: 0,
        offsetY: 0
      },
      title: {
        text: "Luna / Ethereum price",
        rotate: -90,
        offsetX: 0,
        offsetY: 0,
        style: {
          color: undefined,
          fontSize: '18px',
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 600,
          cssClass: 'apexcharts-yaxis-title',
        },
      },
      crosshairs: {
        show: true,
        position: 'back',
        stroke: {
          color: '#b6b6b6',
          width: 1,
          dashArray: 0,
        },
      },
      tooltip: {
        enabled: true,
        offsetX: 0,
      },

    };
    this.xaxis = {
      type: "datetime"
    };
    this.tooltip = {
      shared: false,
      y: {
        formatter: function (val) {
          return (val / 0.1).toFixed(0);
        }
      }
    };
  }

  async ngOnInit() {
    console.log(this.messageService.getData())
    await this.getCoinGecko()
    await this.getAlphaVantage()
    this.zipper()
    console.log("Hello world")
    console.log(this.final_timeseries)
    this.initChartData();
  }


  timeseries1: any;
  timeseries2: any;

  stock_code: string = "AMZN"
  async getAlphaVantage() {
    let data = await firstValueFrom(this._http.getUrl(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${this.stock_code}&outputsize=full&apikey=BQCUKE3R9K0EQ76H`))

    let keys = Object.keys(data["Time Series (Daily)"])
    let timeseries = []
    for (let i = 0; i < keys.length; i++) {
      timeseries.push([Math.floor(new Date(keys[i]).getTime()), parseFloat(data["Time Series (Daily)"][keys[i]]['4. close'])]);
    }

    this.timeseries1 = timeseries
    console.log(this.timeseries1[0])
  }

  crypto_code: string = 'bitcoin';
  async getCoinGecko() {
    let data = await firstValueFrom(this._http.getUrl(`https://api.coingecko.com/api/v3/coins/${this.crypto_code}/market_chart?vs_currency=usd&days=max&interval=daily`))

    this.timeseries2 = data['prices'].reverse().slice(1)

    console.log(this.timeseries2[0])
  }

  final_timeseries: any[] = [];
  biggest_number: any[] = [];

  zipper() {
    if (this.timeseries1.length > this.timeseries2.length) {
      var series_length = this.timeseries1.length;
    } else {
      var series_length = this.timeseries2.length;
    }

    var offset1 = 0;
    var offset2 = 0;
    var timeseries_transfored = []

    //Deals with situations where both timeseries dont match exactly
    for (let i = 0; i < series_length; i++) {

      try {

        if (this.timeseries1[i][0] === this.timeseries2[i][0]) {
          timeseries_transfored.push(this.timeseries1[i][0], this.timeseries1[i][1] / this.timeseries2[i][1])
        } else if (this.timeseries1[i][0] > this.timeseries2[i][0]) {
          offset1 = Math.round((this.timeseries1[i][0] - this.timeseries2[i][0]) / 86400000)
        } else {
          offset2 = Math.round((this.timeseries2[i][0] - this.timeseries1[i][0]) / 86400000)
        }

        // console.log([this.timeseries1[i][0], this.timeseries1[i][1]])
        // console.log([this.timeseries2[i][0], this.timeseries2[i][1]])
        // console.log(offset1, offset2)
        // console.log({Adjusted: this.timeseries2[i+offset2][0]})

        //zipping logic
        //this.final_timeseries.push(1)
        this.final_timeseries.push([this.timeseries2[i+offset2][0], this.timeseries1[i][1]/this.timeseries2[i+offset2][1]])
        this.biggest_number.push(this.timeseries1[i][1]/this.timeseries2[i+offset2][1])
        // console.error(error)
      } catch (e) {
        console.error(e)
      }
    }
  } 
  //timeseries2 = coingecko
  //timeseries1 = stocks


}
