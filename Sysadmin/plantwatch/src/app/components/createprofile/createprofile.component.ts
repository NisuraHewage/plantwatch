import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/profile.service';

@Component({
  selector: 'app-createprofile',
  templateUrl: './createprofile.component.html',
  styleUrls: ['./createprofile.component.css']
})
export class CreateprofileComponent implements OnInit {

  selectedFile: any;

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
  }

  onFileChanged(event: any) {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);
  }

  submitForm(event: any){
    const uploadData = new FormData();
    uploadData.append('myFile', this.selectedFile, this.selectedFile.name);
    uploadData.append('name', 'John');
    this.profileService.uploadTest(uploadData);
  }
}
