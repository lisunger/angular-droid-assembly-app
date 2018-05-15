import { Component } from '@angular/core';
import { EbayHttp } from './ebay-components/services/ebay-http.service';

@Component({
  selector: 'nh-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private http: EbayHttp) { }
  title = 'nh';
  private result = {};

  findUsers(): void {
    this.http
      .searchUsers()
      .subscribe(res => {
        console.log(res.json());
        this.result = res.json();
      });
  }

  searchEbay(keywords: String): void {
    this.http
      .searchEbay(keywords)
      .subscribe(res => {
        console.log(res.json());
        this.result = res.json();
      });
  }

}
