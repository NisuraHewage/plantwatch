import { Component, OnInit } from '@angular/core';
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
  constructor(private _activatedRoute: ActivatedRoute, private profileService: ProfileService, private router: Router) { }

  ngOnInit(): void {
    this.profile = {};
    this._activatedRoute.queryParams.subscribe(
      params =>{
        console.log('queryParams', params['profileId']);
        this.profileService.getPlantProfileById(params['profileId']).subscribe((r: any) => {
          this.profile = r.result[0];
          console.log(this.profile)
        });
      });
    
  }

  editProfile(show: boolean){
    this.showEditProfile = show;
  }

  onFileChanged(event: any) {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);
  }
}
