import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/profile.service';

@Component({
  selector: 'app-list-profiles',
  templateUrl: './list-profiles.component.html',
  styleUrls: ['./list-profiles.component.css']
})
export class ListProfilesComponent implements OnInit {

  profiles: any;
  searchText: string = "";
  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    this.profileService.getPlantProfilesByName(this.searchText).subscribe(p => {
      console.log(p)
      this.profiles = p;
    });
  }

  confirmDeleteProfile(event: any){

  }
}
