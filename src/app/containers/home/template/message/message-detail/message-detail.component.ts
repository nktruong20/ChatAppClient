import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Group } from 'src/app/core/model/group';
import { Message } from 'src/app/core/model/message';
import { User } from 'src/app/core/model/user';
import { AuthenticationService } from 'src/app/core/service/authentication.service';
import { ChatBoardService } from 'src/app/core/service/chat-board.service';
import { saveAs } from 'file-saver';
import { SignalRService } from 'src/app/core/service/signal-r.service';
import { DataHelper } from 'src/app/core/util/data-helper';
import { CallService } from 'src/app/core/service/call.service';
declare const $: any;

@Component({
  selector: 'app-message-detail',
  templateUrl: './message-detail.component.html',
  styleUrls: ['./message-detail.component.css']
})
export class MessageDetailComponent implements OnInit {
  @Input() group!: any;
  @Input() contact!: User;

  currentUser: any = {};
  messages: Message[] = [];
  textMessage: string = "";
  groupInfo: any = null;

  constructor(
    private callService: CallService,
    private chatBoardService: ChatBoardService,
    private authenticationService: AuthenticationService,
    private signalRService: SignalRService) { }

  ngOnInit() {
    this.currentUser = this.authenticationService.currentUserValue;
    this.signalRService.hubConnection.on('messageHubListener', (data) => {
      console.log('messageHubListener')
      this.getMessage();
    });
  }


  ngOnChanges(changes: SimpleChanges): void {
    this.getMessage();
    this.getChatBoardInfo();
    $(".main-box-chat").removeClass("box-contact-info-opened");
  }

  getChatBoardInfo() {
    this.chatBoardService.getChatBoardInfo(this.group == null ? "" : this.group.Code, this.contact == null ? "" : this.contact.Code)
      .subscribe((resp: any) => {
        this.groupInfo = JSON.parse(resp["data"])
      }, (error) => {
        console.log(error);
      })
  }

  getMessage() {
    if (this.group != null) {
      this.getMessageByGroup();
    }
    else if (this.contact != null) {
      this.getMessageByContact();
    }
  }

  getMessageByGroup() {
    this.chatBoardService.getMessageByGroup(this.group?.Code)
      .subscribe((resp: any) => {
        this.messages = JSON.parse(resp["data"]);
      }, (error) => {
        console.log(error)
      })
  }

  getMessageByContact() {
    this.chatBoardService.getMessageByContact(this.contact.Code)
      .subscribe((resp: any) => {
        this.messages = JSON.parse(resp["data"]);
      }, (error) => {
        console.log(error)
      });
  }

  toggleContact() {
    if ($(".main-box-chat").hasClass('box-contact-info-opened')) {
      $(".main-box-chat").removeClass("box-contact-info-opened");
    }
    else {
      $(".main-box-chat").addClass("box-contact-info-opened");
    }
  }

  onKeydown(event: KeyboardEvent) {
    if (!event.shiftKey && event.code == "Enter") {
      this.sendMessage();
      event.preventDefault()
    }
  }

  sendMessage() {
    if (this.textMessage == null || this.textMessage.trim() == "")
      return;

    const formData = new FormData();

    formData.append("data", JSON.stringify({
      SendTo: this.contact == null ? "" : this.contact.Code,
      Content: this.textMessage.trim(),
      Type: "text"
    }));

    this.chatBoardService.sendMessage(this.group == null ? "" : this.group.Code, formData)
      .subscribe((resp: any) => {
        this.textMessage = "";
        // this.getMessage();
      }, (error) => {
        console.log(error);
      });
  }

  sendFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      let filesToUpload: any[] = [];
      for (let i = 0; i < event.target.files.length; i++) {
        filesToUpload.push(event.target.files[i]);
      }
      const formData = new FormData();
      Array.from(filesToUpload).map((file, index) => {
        formData.append("files", file, file.name);
      });

      formData.append("data", JSON.stringify({
        SendTo: this.contact == null ? "" : this.contact.Code,
        Content: this.textMessage.trim(),
        Type: "attachment",
      }));

      this.chatBoardService.sendMessage(this.group == null ? "" : this.group.Code, formData)
        .subscribe((resp: any) => {
          this.textMessage = "";
        }, (error) => {
          console.log(error);
        })
    }
  }

  sendImage(event: any) {
    if (event.target.files && event.target.files[0]) {
      let filesToUpload: any[] = [];
      for (let i = 0; i < event.target.files.length; i++) {
        filesToUpload.push(event.target.files[i]);
      }
      const formData = new FormData();
      Array.from(filesToUpload).map((file, index) => {
        formData.append("files", file, file.name);
      });

      formData.append("data", JSON.stringify({
        SendTo: this.contact == null ? "" : this.contact.Code,
        Content: this.textMessage.trim(),
        Type: "media",
      }));

      this.chatBoardService.sendMessage(this.group == null ? "" : this.group.Code, formData)
        .subscribe((resp: any) => {
          this.textMessage = "";
        }, (error) => {
          console.log(error);
        })
    }
  }

  updateGroupAvatar(evt: any) {
    const target: DataTransfer = <DataTransfer>evt.target;
    if (target.files.length === 0) {
      return;
    }
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      try {
        var bytes = new Uint8Array(e.target.result);
        let img = "data:image/png;base64," + DataHelper.toBase64(bytes);

        this.chatBoardService.updateGroupAvatar({
          Code: this.groupInfo.Code,
          Avatar: img
        })
          .subscribe((resp: any) => {
            const grp = JSON.parse(resp["data"]);
            this.groupInfo.Avatar = grp.Avatar;
            this.group.Avatar = grp.Avatar;
          }, (error) => {
            console.log(error);
          })
      } catch (error) {
        alert("Lỗi ảnh");
      }
    };
    reader.readAsArrayBuffer(target.files[0]);
  }

  downloadFile(path: any, fileName: any) {
    this.chatBoardService
      .downloadFileAttachment(path)
      .subscribe(
        (resp) => {
          saveAs(resp, fileName);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  callVideo() {
    this.callService.call(this.groupInfo.Code)
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
