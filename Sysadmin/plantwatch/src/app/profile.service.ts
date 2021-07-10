import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  uploadTest(uploadData: FormData){
    this.http.post(`${environment.baseGateway}/v1/plantprofiles`, uploadData)
    .subscribe(d => {
    });
  }

  createPlantProfile(plantData: FormData){
    return this.http.post(`${environment.baseGateway}/v1/plantprofiles`, plantData);
  }

  updatePlantProfile(plantData: FormData){
    return this.http.put(`${environment.baseGateway}/v1/profiles`, plantData)
  }

  deletePlantProfile(id: string){
    return this.http.request('delete',`${environment.baseGateway}/v1/profiles?profileId=${id}`, { body: {profileId: id} });
  }

  getPlantProfileById(id: any){
    return this.http.get(`${environment.baseGateway}/v1/profile?profileId=${id}`);
  }

  getPlantProfilesByName(name: any){
    return this.http.get(`${environment.baseGateway}/v1/profiles?plantName=${name}`);
  }

  getParametersByProfileId(id: any){
    return this.http.get(`${environment.baseGateway}/v1/parameters?profileId=${id}`);
  }

  upsertParameters(params: any){
    const headers = { 'content-type': 'application/json'}  
    return this.http.post(`${environment.baseGateway}/v1/parameters`, params, {'headers': headers});
  }

  createKnowledgeBase(plantData: FormData){
    return this.http.post(`${environment.baseGateway}/v1/plantprofiles`, plantData)
    .subscribe(d => {
    });
  }

  updateKnowledgeBase(plantData: FormData){
    return this.http.post(`${environment.baseGateway}/v1/plantprofiles`, plantData)
    .subscribe(d => {
    });
  }

  getKnowledgeByProfileId(id: any){
    return [];
  }
}
