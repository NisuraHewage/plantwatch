import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ProfileService } from 'src/app/profile.service';

@Component({
  selector: 'app-add-knowledgebase',
  templateUrl: './add-knowledgebase.component.html',
  styleUrls: ['./add-knowledgebase.component.css']
})
export class AddKnowledgebaseComponent implements OnInit {

  @BlockUI()
  blockUI!: NgBlockUI;

  profile: any;
  selectedFile: any;
  previewImageUrl: any = "";

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
        console.log('queryParams', params['profileId']);
        this.profileService.getPlantProfileById(params['profileId']).subscribe((r: any) => {
          this.profile = r.result[0];
          this.previewImageUrl = this.profile.ImageUrl;
          console.log(this.profile)
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

   readURL(input: any) {
    if (input) {
      var reader = new FileReader();
      
      reader.onload = (e: any) => {
        this.previewImageUrl = e.target.result;
      }
      
      reader.readAsDataURL(input); // convert to base64 string
    }
  }


  onFileChanged(event: any) {
    this.selectedFile = event.target.files[0];
    this.readURL(this.selectedFile);
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
      this.blockUI.stop();
    //  location.reload();
     this.router.navigate([`/profile`], {queryParams: {profileId: this.profile.Id}});
    }, err => {
      this.blockUI.stop();
    });
  }

}
