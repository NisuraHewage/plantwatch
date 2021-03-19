import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from 'src/app/profile.service';

@Component({
  selector: 'app-upsert-params',
  templateUrl: './upsert-params.component.html',
  styleUrls: ['./upsert-params.component.css']
})
export class UpsertParamsComponent implements OnInit {

  parameters: any;
  selectedParameterType: string = "";

  constructor(private profileService: ProfileService, private router: Router, private _activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.parameters = [];
    this._activatedRoute.queryParams.subscribe(
      params =>{
        console.log('queryParams', params['profileId']);
        this.profileService.getParametersByProfileId(params['profileId']).subscribe((r: any) => {
          this.parameters = r.result[0];
          console.log(this.parameters)
        });
      });
  }

  selectParamType(event: any){
    this.selectParamType = event.target.value;
  }

  addParameter(){

  }

  save(){

  }
}
