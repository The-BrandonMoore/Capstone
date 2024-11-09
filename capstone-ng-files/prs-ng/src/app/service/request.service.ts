import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Request } from '../model/request.class';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';

const URL = 'http://localhost:5091/api/Requests';
@Injectable({
  providedIn: 'root',
})
export class RequestService {
  constructor(private http: HttpClient) {}

  //get all
  list(): Observable<any[]> {
    return this.http.get(URL) as Observable<any[]>;
  }
  //Add Request
  add(newRequest: Request): Observable<Request> {
    return this.http.post(URL, newRequest) as Observable<Request>;
  }

  getById(id: number): Observable<Request> {
    return this.http.get(URL + '/' + id) as Observable<Request>;
  }

  editRequest(id: number, request: Request): Observable<Request> {
    return this.http.put(URL + '/' + id, request) as Observable<Request>;
  }

  delete(id: number): Observable<any> {
    return this.http.delete(URL + '/' + id);
  }

  submitForReview(id: number, request: Request): Observable<Request> {
    return this.http.put(
      URL + '/submit-review/' + id,
      request
    ) as Observable<Request>;
  }

  getRequestsForReview(userId: number): Observable<Request[]> {
    return this.http.get(URL + '/list-review/' + userId) as Observable<
      Request[]
    >;
  }

  requestApprove(requestId: number, request: Request): Observable<Request> {
    return this.http.put(
      URL + '/approve/' + requestId,
      request
    ) as Observable<Request>;
  }

  requestReject(requestId: number, request: Request): Observable<Request> {
    return this.http.put(
      URL + '/reject/' + requestId,
      request
    ) as Observable<Request>;
  }
}
