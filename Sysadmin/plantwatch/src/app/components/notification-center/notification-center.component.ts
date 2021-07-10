import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ProfileService } from 'src/app/profile.service';

@Component({
  selector: 'app-notification-center',
  templateUrl: './notification-center.component.html',
  styleUrls: ['./notification-center.component.css']
})
export class NotificationCenterComponent implements OnInit {

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
    this.searchProfiles();
  }


}
