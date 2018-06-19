import { Component, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { EbayHttpService } from '../../services/ebay-search.service';
import { EbayResult } from '../../data-models/ebay-result.model';

@Component({
  selector: 'nk-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CreateProjectComponent {

  constructor(private authService: AuthService, private ebayService: EbayHttpService) { }

  public searchTerm = '';
  public resultData;
  public resultCount: number;
  public parsedData: EbayResult;

  onSearch(): void {
    if (this.searchTerm !== undefined && this.searchTerm !== '') {
      this.ebayService.searchEbay(this.searchTerm)
        .subscribe(res => {
          this.resultData = res;
          this.parseResultData();
        });
    }
  }

  paginate(event): void {
    console.log(event);
    this.ebayService.searchEbay(this.searchTerm, event.rows, event.page)
      .subscribe(res => {
        this.resultData = res;
        this.parseResultData();
      });
  }

  private parseResultData(): void {
    this.parsedData = new EbayResult(this.resultData);
    this.resultCount = this.parsedData.resultCount;
  }

}
