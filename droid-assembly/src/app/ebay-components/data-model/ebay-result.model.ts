import { EbayItem } from './ebay-item';

export class EbayResult {
  resultCount: number;
  successful: boolean;
  pageNumber: number;
  entriesPerPage: number;
  totalPages: number;
  totalEntries: number;
  ebayPage: string;
  resultList: EbayItem[] = [];

  constructor(jsonData: string) {
    console.log('JSON DATA: ', jsonData);

    jsonData = jsonData['findItemsByKeywordsResponse'][0];
    this.resultCount = jsonData['searchResult'][0]['@count'];
    this.successful = jsonData['ack'][0] === 'Success';
    this.pageNumber = jsonData['paginationOutput'][0]['pageNumber'];
    this.entriesPerPage = jsonData['paginationOutput'][0]['entriesPerPage'];
    this.totalPages = jsonData['paginationOutput'][0]['totalPages'];
    this.totalEntries = jsonData['paginationOutput'][0]['totalEntries'];
    this.ebayPage = jsonData['itemSearchURL'][0];
    if (this.resultCount > 0) {
      jsonData['searchResult'][0]['item'].forEach((item) => {
        this.resultList.push(new EbayItem(item));
      });
    }
  }

}
