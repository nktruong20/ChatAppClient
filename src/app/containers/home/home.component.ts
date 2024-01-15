import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { Constants } from 'src/app/core/util/constants';
import { User } from 'src/app/core/model/user';
import { AuthenticationService } from 'src/app/core/service/authentication.service';
import { CallService } from 'src/app/core/service/call.service';
import { ChatBoardService } from 'src/app/core/service/chat-board.service';
import { SignalRService } from 'src/app/core/service/signal-r.service';
import { UserService } from 'src/app/core/service/user.service';
import { ListCallComponent } from './template/call/list-call/list-call.component';
import { ListContactComponent } from './template/contact/list-contact/list-contact.component';
import { ListMessageComponent } from './template/message/list-message/list-message.component';
declare const $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('listMessage', { static: true }) listMessage!: ListMessageComponent;
  @ViewChild('listCall', { static: true }) listCall!: ListCallComponent;
  @ViewChild('listContact', { static: true }) listContact!: ListContactComponent;

  currentUser: any = {};
  userProfile: User | any = {};
  tabControls: any[] = [
    {
      title: 'Tin nhắn',
      iconClass: 'mdi-message-text'
    },
    {
      title: 'Cuộc gọi',
      iconClass: 'mdi-phone'
    },
    {
      title: 'Danh bạ',
      iconClass: 'mdi-account-box-outline'
    },
    {
      title: 'Thông báo',
      iconClass: 'mdi-bell-outline'
    }
  ]
  tabIndexSelected: number = 0;

  memberInNewGroup: User[] = [];

  filter = {
    keySearch: "",
    groupName: "",
    group: null,
    contact: null,
    groupCall: null,
  };

  constructor(
    private authenticationService: AuthenticationService,
    private callService: CallService,
    private chatBoardService: ChatBoardService,
    private userService: UserService,
    private signalRService: SignalRService,
    private ngZone: NgZone,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    this.currentUser = this.authenticationService.currentUserValue;
    this.signalRService.startConnection();
    // lắng nghe tin nhắn trả về => xử lý
    this.signalRService.hubConnection.on('messageHubListener', (data) => {
      console.log('messageHubListener', data)
      this.listMessage.getData();
    });
    // lắng nghe cuôc gọi đến => xử lý
    this.signalRService.hubConnection.on('callHubListener', (data) => {
      console.log('callHubListener')
      this.openModalCall(data);
    });
  }

  clickTab(tabIndex: any) {
    this.tabIndexSelected = tabIndex;
  }

  onClickMessage(group: any) {
    this.filter.group = group;
  }

  onClickCall(groupCall: any) {
    this.filter.groupCall = groupCall;
  }

  onClickContact(contact: any) {
    this.filter.contact = contact;
  }

  //#region thêm mới liên hệ

  contactSearchs: User[] = [];

  openModalAddContact() {
    this.filter.keySearch = "";
    this.contactSearchs = [];
    $("#modalAddContact").modal();
  }

  searchContact() {
    this.userService.searchContact(this.filter.keySearch)
      .subscribe((resp: any) => {
        this.contactSearchs = JSON.parse(resp["data"]);
      }, (error) => {
        console.log(error)
      })
  }

  submitAddContact(contact: any) {
    this.userService.addContact(contact)
      .subscribe((resp: any) => {
        this.toastr.success("Thêm thành công")
        $("#modalAddContact").modal("hide");
        this.listContact.getContact();
      }, (error) => {
        console.log(error)
      })
  }

  //#endregion

  //#region cập nhật profile

  openModalProfile() {
    this.spinner.show();
    this.userService.getProfile()
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe((resp: any) => {
        this.userProfile = JSON.parse(resp["data"]);
        $("#modalProfile").modal();
      }, (error) => {
        console.log(error)
      })
  }

  onloadAvatar(img: any) {
    this.userProfile.Avatar = img;
  }

  updateProfile() {
    this.spinner.show();
    this.userService.updateProfile(this.userProfile)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe((resp: any) => {
        this.userProfile = JSON.parse(resp["data"]);
        this.toastr.success("Cập nhật thành công");
        this.currentUser.Avatar = this.userProfile.Avatar;
        this.currentUser.FullName = this.userProfile.FullName;
        localStorage.setItem(Constants.LOCAL_STORAGE_KEY.SESSION, JSON.stringify(this.currentUser));
        $("#modalProfile").modal("hide");
      }, (error) => {
        this.toastr.error(error.error.message);
      })
  }

  //#endregion

  //#region thêm mới nhóm chat

  openModalAddGroup() {
    this.filter.groupName = "";
    this.userService.getContact()
      .subscribe((resp: any) => {
        this.memberInNewGroup = JSON.parse(resp["data"]);
        this.memberInNewGroup.forEach(x => x.fieldStamp1 = false);
        $("#modalAddGroup").modal();
      }, (error) => {
        console.log(error)
      })
  }

  addMemberToGroup(member: User) {
    member.fieldStamp1 = true;
  }

  removeMemberToGroup(member: User) {
    member.fieldStamp1 = false;
  }

  submitAddGroup() {
    if (this.filter.groupName == null || this.filter.groupName.trim() == '') {
      this.toastr.error("Tên nhóm không được để trống");
      return;
    }

    if (this.memberInNewGroup.filter(x => x.fieldStamp1).length == 0) {
      this.toastr.error("Danh sách thành viên không được để trống");
      return;
    }

    this.chatBoardService.addGroup({
      Name: this.filter.groupName,
      Users: this.memberInNewGroup.filter(x => x.fieldStamp1)
    })
      .subscribe((resp: any) => {
        this.toastr.success("Thêm thành công")
        $("#modalAddGroup").modal("hide");
        this.listMessage.getData();
      }, (error) => {
        console.log(error)
      })
  }

  //#endregion

  openModalCall(url: any) {
    if (confirm("Có cuộc gọi đến")) {
      this.callService
        .joinVideoCall($("#inComingCallIframe").attr("src"))
        .subscribe((resp: any) => {
          $("#modalInComingCall").modal();
          $("#inComingCallIframe").attr("src", url)
        }, (error) => {
          console.log(error)
        })
    }
  }

  rejectCall() {
    $("#modalInComingCall").modal("hide");
    $("#inComingCallIframe").attr("src", "");
    this.listCall.getData();
  }

  cancelVideoCall() {
    this.callService
      .cancelVideoCall($("#outgoingCallIframe").attr("src"))
      .subscribe((resp: any) => {
        $("#modalOutgoingCall").modal("hide");
        $("#outgoingCallIframe").attr("src", "");
        this.listCall.getData();
      }, (error) => {
        console.log(error)
      })
  }

  navigate(path: string): void {
    this.ngZone.run(() => this.router.navigateByUrl(path)).then();
  }
}