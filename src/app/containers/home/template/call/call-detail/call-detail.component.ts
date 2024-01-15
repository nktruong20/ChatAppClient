import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Call } from 'src/app/core/model/call';
import { GroupCall } from 'src/app/core/model/group-call';
import { CallService } from 'src/app/core/service/call.service';
declare const $: any;

@Component({
  selector: 'app-call-detail',
  templateUrl: './call-detail.component.html',
  styleUrls: ['./call-detail.component.css']
})
export class CallDetailComponent implements OnInit {
  @Input() groupCall!: any;

  calls: Call[] = [];
  constructor(
    private callService: CallService
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ("groupCall" in changes) {
      this.getGroupCallDetail();
    }
  }

  getGroupCallDetail() {
    if (this.groupCall == null)
      return;

    this.callService.getCallHistoryById(this.groupCall.Code)
      .subscribe((resp: any) => {
        this.calls = JSON.parse(resp["data"]);
      }, (error) => {
        console.log(error)
      })
  }

  callVideo(code: any) {
    this.callService.call(code)
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
