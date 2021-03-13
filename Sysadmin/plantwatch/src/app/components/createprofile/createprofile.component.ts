import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/profile.service';

import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-createprofile',
  templateUrl: './createprofile.component.html',
  styleUrls: ['./createprofile.component.css']
})
export class CreateprofileComponent implements OnInit {

  selectedFile: any;

  profileForm = new FormGroup({
    plantName: new FormControl(''),
    scientificName: new FormControl(''),
    briefDescription: new FormControl(''),
    countryOfOrigin: new FormControl(''),
    size: new FormControl(''),
    soil: new FormControl(''),
    color: new FormControl(''),
  });

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    this.selectedFile = null;
  }

  onFileChanged(event: any) {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);
  }

  submitForm(event: any){
    event.preventDefault();
    let uploadData : any = new FormData();
    if(this.selectedFile != null){
      uploadData.append('profileImage', this.selectedFile, this.selectedFile.name);
    }
    for(let key in this.profileForm.value){
      console.log(key + " - " + this.profileForm.value[key]);
      uploadData.append(key, this.profileForm.value[key]);
    }
    console.log(uploadData);
    for (var key of uploadData.entries()) {
      console.log(key[0] + ', ' + key[1]);
  }

    console.log(this.profileForm);
    //this.profileService.uploadTest(uploadData);
  }
}
