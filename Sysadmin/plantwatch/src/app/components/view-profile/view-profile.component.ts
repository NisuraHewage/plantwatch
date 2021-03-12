import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit {

  showEditProfile = false;
  selectedFile: any;
  constructor() { }

  ngOnInit(): void {
  }

  editProfile(show: boolean){
    this.showEditProfile = show;
  }

  onFileChanged(event: any) {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);
  }
}
