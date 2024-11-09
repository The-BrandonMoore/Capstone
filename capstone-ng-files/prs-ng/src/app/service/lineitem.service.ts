import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LineItem } from '../model/lineitem.class';

const URL = 'http://localhost:5091/api/LineItems';
@Injectable({
  providedIn: 'root',
})
export class LineitemService {
  constructor(private http: HttpClient) {}

  add(lineitem: LineItem): Observable<LineItem> {
    return this.http.post(URL, lineitem) as Observable<LineItem>;
  }

  delete(id: number): Observable<LineItem> {
    return this.http.delete(URL + '/' + id) as Observable<LineItem>;
  }

  //getById -- this is viewing a single instance of a LineItem
  getById(id: number): Observable<LineItem> {
    return this.http.get(URL + '/' + id) as Observable<LineItem>;
  }

  //put edit() -- this is called with the submit/save changes button.
  editLineitem(lineitem: LineItem): Observable<LineItem> {
    return this.http.put(
      URL + '/' + lineitem.id,
      lineitem
    ) as Observable<LineItem>;
  }

  getRequestById(requestId: number): Observable<LineItem[]> {
    return this.http.get(URL + '/lines-for-req/' + requestId) as Observable<
      LineItem[]
    >;
  }
}
