import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../services/api-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userDetails: any;
  role: any;
  profileData: any;
  constructor(private apiServiceService: ApiServiceService, private router: Router) { }
  ngOnInit() {
    this.verifyToken();
    this.getRole();
  }
  verifyToken() {
    this.apiServiceService.verifyToken().subscribe(data => {
      if (!data['auth']) this.router.navigate(['login'])
    }, err => console.error(err))
  }
  getUser() {
    this.apiServiceService.getUsers().subscribe(
      data => {
        this.userDetails = data
      },
      err => console.error(err)
    );
  }
  logout() {
    localStorage.clear();
    this.router.navigate(['login']);
  }
  getRole() {
    this.apiServiceService.getRole({ email: localStorage.getItem('email') }).subscribe(
      data => {
        this.role = data['data']['role']
        if (this.role === 'admin') {
          this.getUser();
        } else {
          this.profileData = data['data']
        }
      },
      err => console.error(err)
    );
  }
}
