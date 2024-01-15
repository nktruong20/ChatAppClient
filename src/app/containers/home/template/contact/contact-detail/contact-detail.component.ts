import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CallService } from 'src/app/core/service/call.service';
declare const $: any;

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})
export class ContactDetailComponent implements OnInit {
  @Input() contact!: any;

  toggleTabChat: boolean = false;
  constructor(
    private callService: CallService
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ("contact" in changes) {
      this.toggleTabChat = false;
    }
  }

  chat() {
    this.toggleTabChat = true;
  }

  callVideo() {
    this.callService.call(this.contact.Code)
      .subscribe((resp: any) => {
        let data = JSON.parse(resp["data"]);
        $("#outgoingCallIframe").attr("src", data);
        $("#modalOutgoingCall").modal();
        console.log('callVideo', data)
      }, (error) => {
        console.log(error)
      });
  }
}
