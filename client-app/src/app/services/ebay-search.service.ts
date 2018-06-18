import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { EBAY_API_KEY } from '../api-keys';

@Injectable()
export class EbayHttpService {

  private API_KEY = EBAY_API_KEY;

  constructor(private http: Http) { }

  public searchUsers(): Observable<Response> {
    const serverUrl = 'http://localhost:3000/users';
    return this.http.get(serverUrl);
  }

  public searchEbay(keywords: String, resultsPerPage?: number, pageNumber?: number): Observable<Response> {
    let serverUrl = '/ebay';
    serverUrl += '?OPERATION-NAME=findItemsByKeywords';
    serverUrl += '&SERVICE-VERSION=1.0.0';
    serverUrl += '&SERVICE-NAME=FindingService';
    serverUrl += '&RESPONSE-DATA-FORMAT=JSON';
    serverUrl += `&SECURITY-APPNAME=${this.API_KEY}`;
    serverUrl += '&REST-PAYLOAD';
    serverUrl += `&keywords=${keywords}`;
    if (resultsPerPage) {
      serverUrl += `&paginationInput.entriesPerPage=${resultsPerPage}`;
    }
    if (pageNumber) {
      serverUrl += `&paginationInput.pageNumber=${pageNumber}`;
    }

    return this.http.get(serverUrl);
  }

  // public searchDB(keyword: String): Observable<Response> {
  //   let serverUrl = 'http://localhost:3000/';
  //   serverUrl += 'searchResult';
  //   return this.http.get(serverUrl);
  // }
}
