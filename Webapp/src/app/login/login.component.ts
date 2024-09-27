import { ApiServiceService } from './../services/api-service.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  title = 'final-example';
  emailPattern = "(?=^.{8,255}$)((?=.*\d)(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[^A-Za-z0-9])(?=.*[a-z])|(?=.*[^A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[A-Z])(?=.*[^A-Za-z0-9]))^.*";
  angularForm = new FormGroup({
    email: new FormControl(),
    password: new FormControl()
  });
  constructor(private fb: FormBuilder, private apiServiceService: ApiServiceService, public router: Router) {
    this.createForm();
  }
  ngOnInit() {
    this.verifyToken();
  }
  verifyToken() {
    this.apiServiceService.verifyToken().subscribe(data => {
      if (data['auth']) this.router.navigate(['dashboard'])
    }, err => console.error(err))
  }
  onSubmit() {
    this.apiServiceService.login(this.angularForm.value).subscribe(
      data => {
        localStorage.setItem('token', data['data']['token'])
        localStorage.setItem('email', this.angularForm.value.email)
        this.router.navigate(['dashboard'])
      },
      err => console.error(err)
    );
  }
  createForm() {
    this.angularForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
    });
  }
}
