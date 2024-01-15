import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { User } from 'src/app/core/model/user';
import { UserService } from 'src/app/core/service/user.service';

@Component({
  selector: 'app-list-contact',
  templateUrl: './list-contact.component.html',
  styleUrls: ['./list-contact.component.css']
})
export class ListContactComponent implements OnInit {
  @Output() onClick = new EventEmitter<User>();

  contacts: User[] = [];
  itemIndexSelected: number = -1;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.getContact();
  }

  getContact() {
    this.userService.getContact()
      .subscribe((resp: any) => {
        this.contacts = JSON.parse(resp["data"]);
        this.itemIndexSelected = -1;
      }, (error) => {
        console.log(error)
      })
  }

  openContact(indexContact: any) {
    this.itemIndexSelected = indexContact;
    this.onClick.emit(this.contacts[indexContact]);
  }
}
