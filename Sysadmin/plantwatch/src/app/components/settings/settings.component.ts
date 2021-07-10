import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  profileForm = new FormGroup({
    username: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl('')
  });
  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.profileForm.patchValue({
        username: 'nishad',
        email: 'nishad@plantwatch.com',
        password: '123'
      });
      
    }, 1000)
  }

}
