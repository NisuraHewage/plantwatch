import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from 'src/app/profile.service';

import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit {
  @BlockUI()
  blockUI!: NgBlockUI;

  profile: any;
  showEditProfile = false;
  selectedFile: any;

  detailsSetion: string = "all";

  profileForm = new FormGroup({
    plantName: new FormControl(''),
    scientificName: new FormControl(''),
    plantDescription: new FormControl(''),
    watering: new FormControl(''),
    temperature: new FormControl(''),
    soil: new FormControl(''),
    sunlight: new FormControl(''),
    pests: new FormControl(''),
    diseases: new FormControl(''),
    fertilizer: new FormControl(''),
  });

  constructor(private _activatedRoute: ActivatedRoute, private profileService: ProfileService, private router: Router) { }

  ngOnInit(): void {
    this.profile = {};
    this.blockUI.start();
    this._activatedRoute.queryParams.subscribe(
      params =>{
        this.profileService.getPlantProfileById(params['profileId']).subscribe((r: any) => {
          this.profile = r.result[0];
          console.log()
          this.profileForm.patchValue({
            plantName: this.profile.Name,
            scientificName: this.profile.ScientificName,
            plantDescription: this.profile.PlantDescription,
            watering: this.profile.Watering,
            temperature: this.profile.Temperature,
            soil: this.profile.Soil,
            sunlight: this.profile.Sunlight,
            pests: this.profile.Pets,
            diseases: this.profile.Diseases,
            fertilizer: this.profile.Fertilizer,
          });
          this.blockUI.stop();
        });
      });
    
  }

  editProfile(show: boolean){
    this.showEditProfile = show;
  }

  onFileChanged(event: any) {
    this.selectedFile = event.target.files[0];
  }

  saveProfile(event: any){
    event.preventDefault();
    let uploadData : any = new FormData();
    if(this.selectedFile != null){
      uploadData.append('profileImage', this.selectedFile, this.selectedFile.name);
    }
    for(let key in this.profileForm.value){
      console.log(key + " - " + this.profileForm.value[key]);
      if(this.profileForm.value[key] != null){
        uploadData.append(key, this.profileForm.value[key]);
      }
    }
    console.log(uploadData);
    for (var key of uploadData.entries()) {
      console.log(key[0] + ', ' + key[1]);
  }

    this.blockUI.start();
    this.profileService.updatePlantProfile(uploadData).subscribe((r: any) => {
      // redirect to upsert vitals
      console.log(r)
      alert('Successfully Updated!');
      location.reload();
     //this.router.navigate([`/profile`], {queryParams: {profileId: this.profile.Id}});
    }, err => {
      this.blockUI.stop();
    });
  }

  selectSection(section: string){
    console.log(section)
    this.detailsSetion = section;
  }
}
