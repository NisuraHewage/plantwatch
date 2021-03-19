import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/profile.service';

import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-list-profiles',
  templateUrl: './list-profiles.component.html',
  styleUrls: ['./list-profiles.component.css']
})
export class ListProfilesComponent implements OnInit {
  @BlockUI()
  blockUI!: NgBlockUI;
  profiles: any;
  searchText: any;
  profileToDelete: any = null;
  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    this.searchText = "";
    this.profiles = [];
    this.blockUI.start();
    this.profileService.getPlantProfilesByName(this.searchText).subscribe((p:any) => {
      this.profiles = p.result;
      this.blockUI.stop();
    });
  }

  searchProfiles(){
    this.blockUI.start();
    this.profileService.getPlantProfilesByName(this.searchText).subscribe((p:any) => {
      this.profiles = p.result;
      this.blockUI.stop();
    });
  }

  updateSearch(event: any){
    this.searchText = event.target.value;
  }

  confirmDeleteProfile(){
    this.profileService.deletePlantProfile(this.profileToDelete.Id).subscribe(d => {
      this.profileToDelete = null;
      alert("Successfully deleted!")

    }, e=> {
      console.log(e);
      alert('Unable to delete profile as it is already assigned to plants');
    })
    // Show modal
  }

  setProfileToDelete(profile: any){
    this.profileToDelete = profile;
  }
}
