import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from 'src/app/profile.service';

import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-upsert-params',
  templateUrl: './upsert-params.component.html',
  styleUrls: ['./upsert-params.component.css']
})
export class UpsertParamsComponent implements OnInit {
  @BlockUI()
  blockUI!: NgBlockUI;

  parameters: any;
  selectedParameterType: string = "light";
  profileId: string = "";

  constructor(private profileService: ProfileService, private router: Router, private _activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.parameters = [];
    this.blockUI.start();
    this._activatedRoute.queryParams.subscribe(
      params =>{
        console.log('queryParams', params['profileId']);
        this.profileId = params['profileId'];
        this.profileService.getParametersByProfileId(this.profileId).subscribe((r: any) => {
          this.parameters = r.result;
          this.blockUI.stop();
          console.log(this.parameters)
        });
      });
  }

  selectParamType(event: any){
    this.selectedParameterType = event.target.value;
  }

  updateField(name: string, type: string, event: any){
    console.log(name);
    console.log(type);
    console.log(event.target.value);
    let field = this.parameters.filter((p: any) => p.Name == name)[0];
    console.log(field)
    field[type] = event.target.value;
  }

  addParameter(){
    let parameter = {
      LowerLimit: "",
      UpperLimit: "",
      Name: this.selectedParameterType,
      Message: "",
      Action: ""
    };
    if(this.parameters.filter((p: any) => p.Name == this.selectedParameterType).length == 0){
      this.parameters.push(parameter);
    }
  }

  removeParameter(name: any){
    this.parameters = this.parameters.filter((p: any) => p.Name != name);
  }

  save(){
    let payload = {
      plantProfileId: this.profileId,
      parameters: this.parameters
    }
    console.log(JSON.stringify(payload));
    this.blockUI.start();
    this.profileService.upsertParameters(payload).
    subscribe(d => {
      console.log(d);
      this.blockUI.stop();
      alert("Successfully updated parameters")
      this.router.navigate([`/profile`], {queryParams: {profileId: this.profileId}});
    }, e=> {
      console.log(e);
      this.blockUI.stop();
      alert('Error occured while updating parameters');
    });
  }
}
