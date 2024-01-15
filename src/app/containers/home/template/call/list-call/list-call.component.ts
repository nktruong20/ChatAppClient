import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GroupCall } from 'src/app/core/model/group-call';
import { CallService } from 'src/app/core/service/call.service';
declare const $: any;

@Component({
  selector: 'app-list-call',
  templateUrl: './list-call.component.html',
  styleUrls: ['./list-call.component.css']
})
export class ListCallComponent implements OnInit {
  @Output() onClick = new EventEmitter<GroupCall>();

  datas: GroupCall[] = [];
  groupCallSelected!: string;

  constructor(
    private callService: CallService
  ) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.callService.getCallHistory()
      .subscribe((resp: any) => {
        this.datas = JSON.parse(resp["data"]);
      }, (error) => {
        console.log("error")
      })
  }

  openCall(key: any) {
    this.groupCallSelected = key;
    this.onClick.emit(this.datas.find(x => x.Code == key));
  }

  callVideo(code: any) {
    this.callService.call(code)
      .subscribe((resp: any) => {
        let data = JSON.parse(resp["data"]);
        $("#outgoingCallIframe").attr("src", data);
        $("#modalOutgoingCall").modal();
      }, (error) => {
        console.log(error)
      });
  }
}
