import { Component, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { EbayHttpService } from '../../services/ebay-search.service';
import { EbayResult } from '../../data-models/ebay-result.model';
import { EbayItem } from '../../data-models/ebay-item';

@Component({
  selector: 'nk-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CreateProjectComponent {
  constructor(
    private authService: AuthService,
    private ebayService: EbayHttpService
  ) {}

  public searchTerm = '';
  public resultData;
  public resultCount: number;
  public parsedData: EbayResult;
  public selectedItems: EbayItem[] = [];
  public draggedItem: EbayItem;

  paginate(event): void {
    if (this.searchTerm !== undefined && this.searchTerm.length > 0) {
      this.ebayService
      .searchEbay(this.searchTerm, event.rows, event.page)
      .subscribe(res => {
        this.resultData = res;
        this.parseResultData();
      });
    }
  }

  private parseResultData(): void {
    this.parsedData = new EbayResult(this.resultData);
    console.log(this.parsedData);
    this.resultCount = this.parsedData.resultCount;
  }

  dragStart(event, item: EbayItem) {
    console.log('drag start');
    this.draggedItem = item;
  }

  dragEnd(event) {
    console.log('drag end');
    this.draggedItem = null;
}

  drop(event) {
    console.log('drop');
    this.selectedItems.push(this.draggedItem);
  }

  removeSelected(index) {
    console.log(index);
    console.log(this.selectedItems.map(i => i.title));

    this.selectedItems.splice(index, 1);
  }

}
