import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: any;
  password: any;

  constructor(private authService: AuthService, private router: Router) { }



  ngOnInit(): void {
  }

  updateUsername(event: any){
    this.username = event.target.value;
  }

  updatePassword(event: any){
    this.password = event.target.value;
  }

  checkLogin(){
    console.log(this.username);
    console.log(this.password);
    let result = this.authService.checkLogin(this.username, this.password);
    console.log(result);
    if(result){
      const item = {
        user: "admin",
        expiry: new Date().getTime() + 3000000,
      }
      localStorage.setItem('og-storage', JSON.stringify(item));
      // redirect to /profiles
      this.router.navigate(['/profiles']);
    }
  }

}
