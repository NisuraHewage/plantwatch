import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  loginUser(email: string, password: string){
    return this.http.post(`${environment.baseGateway}/v1/`, { email, password})
  }

  checkLogin(username: string, password: string){
    if(username == "admin" && password == "123"){
      return true;
    }else{
      return false;
    }
  }

  getuser(){  
    let result = this.getWithExpiry('og-storage');
    return result;  
    }  

  gettoken(){  
    let result = this.getWithExpiry('og-storage') != null;
    console.log(result);
    return result;  
    }  

  private getWithExpiry(key: string) {
    const itemStr = localStorage.getItem(key);
    // if the item doesn't exist, return null
    if (!itemStr) {
      return null
    }

    const item = JSON.parse(itemStr)
    console.log(item);
    const now = new Date()
    console.log(now.getTime());
    // compare the expiry time of the item with the current time
    if (now.getTime() > item.expiry) {
      // If the item is expired, delete the item from storage
      // and return null
      localStorage.removeItem(key);
      return null
    }
    return item.user
  }

  logout(){
    localStorage.removeItem('og-storage');
    location.reload();
  }
}
