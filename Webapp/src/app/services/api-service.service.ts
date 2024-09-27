import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  constructor(public http: HttpClient) { }
  public login(body) {
    return this.http.post('http://localhost:1995/api/login', body)
  }
  public getRole(body) {
    return this.http.post('http://localhost:1995/api/user', body)
  }

  public getUsers() {
    return this.http.get('http://localhost:1995/api/user')
  }

  public verifyToken() {
    return this.http.get('http://localhost:1995/api/me')
  }
}
