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
    return this.http.post(`${environment.baseGateway}/v1/plantprofiles`, plantData);
  }

  updatePlantProfile(plantData: FormData){
    return this.http.put(`${environment.baseGateway}/v1/plantprofiles`, plantData)
    .subscribe(d => {
      console.log(d);
    });
  }

  getPlantProfileById(id: any){
    return {};
  }

  getPlantProfilesByName(name: any){
    return this.http.get(`${environment.baseGateway}/v1/profiles?plantName=${name}`);
  }

  upsertParameters(params: any){
    return this.http.post(`${environment.baseGateway}/v1/plantprofiles`, params)
    .subscribe(d => {
      console.log(d);
    });
  }

  createKnowledgeBase(plantData: FormData){
    return this.http.post(`${environment.baseGateway}/v1/plantprofiles`, plantData)
    .subscribe(d => {
      console.log(d);
    });
  }

  updateKnowledgeBase(plantData: FormData){
    return this.http.post(`${environment.baseGateway}/v1/plantprofiles`, plantData)
    .subscribe(d => {
      console.log(d);
    });
  }

  getKnowledgeByProfileId(id: any){
    return [];
  }
}
