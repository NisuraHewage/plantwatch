import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  uploadTest(uploadData: FormData){
    console.log(uploadData);
    this.http.post('http://localhost:3000/dev/v1/plantprofiles', uploadData)
    .subscribe(d => {
      console.log(d);
    });
  }

}
