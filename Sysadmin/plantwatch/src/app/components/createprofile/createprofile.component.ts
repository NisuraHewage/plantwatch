import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/profile.service';

import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-createprofile',
  templateUrl: './createprofile.component.html',
  styleUrls: ['./createprofile.component.css']
})
export class CreateprofileComponent implements OnInit {

  @BlockUI()
  blockUI!: NgBlockUI;

  selectedFile: any;
  previewImageUrl: any;

  profileForm = new FormGroup({
    plantName: new FormControl(''),
    scientificName: new FormControl('')
  });

  constructor(private profileService: ProfileService, private router: Router) { }

  ngOnInit(): void {
    this.selectedFile = null;
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

  submitForm(event: any){
    event.preventDefault();
    console.log(this.profileForm.value['plantName'])
    if(this.profileForm.value['plantName'] == "" || this.profileForm.value['scientificName'] == ""){
      return;
    }
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

    console.log(this.profileForm);
    this.blockUI.start();
    this.profileService.createPlantProfile(uploadData).subscribe((r: any) => {
      // redirect to upsert vitals
      this.blockUI.stop();
      this.router.navigate([`/knowledge`], {queryParams: {profileId: r.created}});
    });
  }
}
