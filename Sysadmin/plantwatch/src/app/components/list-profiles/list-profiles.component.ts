import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/profile.service';

@Component({
  selector: 'app-list-profiles',
  templateUrl: './list-profiles.component.html',
  styleUrls: ['./list-profiles.component.css']
})
export class ListProfilesComponent implements OnInit {

  profiles: any;
  searchText: any;
  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    this.searchText = "";
    this.profileService.getPlantProfilesByName(this.searchText).subscribe((p:any) => {
      this.profiles = p.result;
    });
  }

  searchProfiles(){
    this.profileService.getPlantProfilesByName(this.searchText).subscribe((p:any) => {
      this.profiles = p.result;
    });
  }

  updateSearch(event: any){
    this.searchText = event.target.value;
  }

  confirmDeleteProfile(event: any){

  }
}
