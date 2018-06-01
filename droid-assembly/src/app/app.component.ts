import { Component } from '@angular/core';
import { EbayHttp } from './ebay-components/services/ebay-http.service';

@Component({
  selector: 'nh-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private http: EbayHttp) { }
}
