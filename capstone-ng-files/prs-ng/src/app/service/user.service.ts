import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../model/user.class';
import { UserLogin } from '../model/user-login.class';

const URL = 'http://localhost:5091/api/Users';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  login(userLogin: UserLogin): Observable<User> {
    return this.http.post(URL + '/login', userLogin) as Observable<User>;
  }

  list(): Observable<User[]> {
    return this.http.get(URL) as Observable<User[]>;
  }

  //addUser(user: user) method POST mapping
  add(user: User): Observable<User> {
    return this.http.post(URL, user) as Observable<User>;
  }

  //delete(id: number)
  delete(id: number): Observable<any> {
    return this.http.delete(URL + '/' + id);
  }

  //getById -- this is viewing a single instance of a User
  getById(id: number): Observable<User> {
    return this.http.get(URL + '/' + id) as Observable<User>;
  }

  //put edit() -- this is called with the submit/save changes button.
  editUser(id: number, user: User): Observable<User> {
    return this.http.put(URL + '/' + id, user) as Observable<User>;
  }
}
