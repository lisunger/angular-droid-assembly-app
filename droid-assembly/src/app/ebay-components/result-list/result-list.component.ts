import { Component, OnInit, Input, OnChanges, ViewEncapsulation, ViewChild } from '@angular/core';
import { EbayResult } from '../data-model/ebay-result.model';
import { Paginator } from 'primeng/paginator';
import { EbayHttp } from '../services/ebay-http.service';

@Component({
  selector: 'nh-result-list',
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ResultListComponent implements OnChanges {

  constructor(private httpService: EbayHttp) { }

  @Input() public rawData;
  @ViewChild('paginator') paginator: Paginator;
  public resultCount: number;
  public parsedData: EbayResult;
  public resultData;
  public searchTerm = '';

  ngOnChanges() {
    if (this.rawData) {
      this.parseResultData();
    }
  }

  private parseResultData(): void {
    this.parsedData = new EbayResult(this.rawData);
    this.resultCount = this.parsedData.resultCount;
  }

  paginate(event): void {
    console.log(event);
    // this.httpService.searchEbay()
  }

  onSearch(): void {
    if (this.searchTerm !== undefined && this.searchTerm !== '') {
      this.httpService.searchEbay(this.searchTerm)
        .subscribe(res => {
          console.log(res.json());
          this.resultData = res.json();
        });
    }
  }

}
