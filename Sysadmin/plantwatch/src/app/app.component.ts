import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthService } from './auth.service';
import  { filter} from 'rxjs/operators' ;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'plantwatch';
  signedIn = false;
  user = "";
  route = "";

  constructor(private authService: AuthService, private _activatedRoute: ActivatedRoute, private router: Router){}

  ngOnInit(){

    this.router.events.pipe(filter((event ) => event instanceof NavigationEnd)).subscribe((val: any) => {
      this.checkLogin();
      this.route = val.url;
    });
  }

  checkLogin(){
    this.user = this.authService.getuser() == null ? "" : this.authService.getuser().toString();
    this.signedIn = this.user == "" ? false : true; 
    
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['/profiles']);
  }
}
