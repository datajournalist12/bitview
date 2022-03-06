import { Component, OnInit } from '@angular/core';
import { MessengerService } from '../messenger.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private messageService:MessengerService) { }

  ngOnInit(): void {
  }

  getCategory(category) {
    this.switchCondition = category

    if (this.submission[0].security_type === null) {
      this.submission[0].security_type = category
    } else{
      this.submission[0].security_name = category
    }
  }

  getCategory2(category) {
    this.switchCondition2 = category

    if (this.submission[1].security_type === null) {
      this.submission[1].security_type = category
    } else{
      this.submission[1].security_name = category
    }
  }

  submission: any = [
    {security_type: null, security_name: null},
    {security_type: null, security_name: null}
  ]
  
  securities: string[] = ['A Cryptocurrency', 'A Stock/ETF', 'A Commodity', 'A Fiat Currency' ]
  cryptos: string[] = ['Bitcoin', "Ethereum", "Chainlink", "Search list"]
  stocks: string[] = ['GME', "AMC", "Tesla", "Search list"]
  commodities: string[] = ['Gold', "Crude Oil", "Coffee", "Search list"]
  fiats: string[] = ['USD', "CHF", "GBP", "Search list"]


  switchCondition: number = 0;
  switchCondition2: number = 0;

  sendMessage(): void {
    this.messageService.sendMessage('Message from Home Component to App Component!');
  }

  dataSubmission() {
    this.messageService.setData(this.submission)
  }
}
 