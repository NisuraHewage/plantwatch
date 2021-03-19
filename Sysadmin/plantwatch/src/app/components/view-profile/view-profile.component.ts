import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from 'src/app/profile.service';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit {

  profile: any;
  showEditProfile = false;
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

  constructor(private _activatedRoute: ActivatedRoute, private profileService: ProfileService, private router: Router) { }

  ngOnInit(): void {
    this.profile = {};
    this._activatedRoute.queryParams.subscribe(
      params =>{
        console.log('queryParams', params['profileId']);
        this.profileService.getPlantProfileById(params['profileId']).subscribe((r: any) => {
          this.profile = r.result[0];

          this.profileForm.patchValue({
            plantName: this.profile.Name,
            scientificName: this.profile.ScientificName
          });
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

    console.log(this.profileForm);
    this.profileService.updatePlantProfile(uploadData).subscribe((r: any) => {
      // redirect to upsert vitals
      console.log(r)
      this.router.navigate([`/profile?profileId=${r.created}`]);
    });
  }
}
