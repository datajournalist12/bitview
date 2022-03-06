import { Component, ViewChild, OnInit, AfterViewInit, HostListener } from "@angular/core";
import { HttpService } from "./../http.service";
import { MessengerService } from "../messenger.service";
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
        data: this.stonks//this.dates
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
      max: 50,//Math.max(...this.dividedByArray),
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

  token1: string = "ethereum"
  token2: string = "tether"

  url1: string = `https://api.coingecko.com/api/v3/coins/${this.token1}/market_chart/range?vs_currency=usd&from=1577836800&to=1646349172`;
  url2: string = `https://api.coingecko.com/api/v3/coins/${this.token2}/market_chart/range?vs_currency=usd&from=999999999&to=1646349172`;
  url3: string = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=AHPI&outputsize=full&apikey=BQCUKE3R9K0EQ76H"
  dividedByArray: any = [];
  days: number[] = [];
  dates: any[] = [];
  stonks: any[] = [];

  subscription: Subscription;

  async ngOnInit(): Promise<void> {
    //----------
    // this.subscription = this.messageService.onMessage().subscribe(
    //   message => {
    //     console.log(message)
    //   });
    console.log(this.messageService.getData())
    //----------
    let firstToken = await firstValueFrom(this._http.getUrl(this.url1))
    let secondToken = await firstValueFrom(this._http.getUrl(this.url2))
    let stocks = await firstValueFrom(this._http.getUrl(this.url3))

    let keys = Object.keys(stocks['Time Series (Daily)'])
    console.log(stocks['Time Series (Daily)']['2022-03-02']['4. close'])

    console.log(keys)

    console.log(secondToken, firstToken)
    console.log({ Value: secondToken['prices'][20][1] })

    for (let i = 0; i < secondToken['prices'].length; i++) {
      try {
        this.dividedByArray.push(firstToken['prices'][i][1] / secondToken['prices'][i][1])
        this.dates.push([secondToken['prices'][i][0], firstToken['prices'][i][1] / secondToken['prices'][i][1]])
        this.stonks.push([Math.floor(new Date(keys[i]).getTime()), stocks['Time Series (Daily)'][keys[i]]['4. close']])
        console.log()
      } catch (error) {
        console.log("One was longer")
      }
    }

    console.log(this.stonks)
    console.log(this.dates)
    console.log(this.dividedByArray)
    console.log(Math.max(...this.dividedByArray))
    console.log(this.yaxis)
    this.initChartData();
  }

  ngAfterViewInit() {
    // this.initChartData();
  }


}
