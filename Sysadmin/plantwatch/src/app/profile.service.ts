import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  uploadTest(uploadData: FormData){
    console.log(uploadData);
    this.http.post(`${environment.baseGateway}/v1/plantprofiles`, uploadData)
    .subscribe(d => {
      console.log(d);
    });
  }

  createPlantProfile(plantData: FormData){
    this.http.post(`${environment.baseGateway}/v1/plantprofiles`, plantData)
    .subscribe(d => {
      console.log(d);
    });
  }

}
