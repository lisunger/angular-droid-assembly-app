import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { EbayResult } from '../data-model/ebay-result.model';
import { Paginator } from 'primeng/paginator';
import { EbayHttp } from '../services/ebay-http.service';

@Component({
  selector: 'nh-result-list',
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ResultListComponent {

  constructor(private httpService: EbayHttp) { }

  @ViewChild('paginator') paginator: Paginator;
  public resultCount: number;
  public parsedData: EbayResult;
  public resultData;
  public searchTerm = '';

  private parseResultData(): void {
    this.parsedData = new EbayResult(this.resultData);
    this.resultCount = this.parsedData.resultCount;
  }

  onSearch(): void {
    if (this.searchTerm !== undefined && this.searchTerm !== '') {
      this.httpService.searchEbay(this.searchTerm)
        .subscribe(res => {
          this.resultData = res.json();
          this.parseResultData();
        });
    }
  }

  paginate(event): void {
    console.log(event);
    this.httpService.searchEbay(this.searchTerm, event.rows, event.page)
      .subscribe(res => {
        this.resultData = res.json();
        this.parseResultData();
      })
  }

}
