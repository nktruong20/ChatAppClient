import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppRoutingApi } from 'src/app/app-routing-api';
import { Group } from '../model/group';

@Injectable({
  providedIn: 'root'
})
export class ChatBoardService {
  constructor(private http: HttpClient) { }

  getHistory() {
    return this.http.get(AppRoutingApi.GetChatHistory);
  }

  getChatBoardInfo(groupCode: string, contactCode: string) {
    return this.http.get(AppRoutingApi.GetChatBoardInfo, {
      params: {
        groupCode,
        contactCode
      }
    });
  }

  addGroup(group: any) {
    return this.http.post(AppRoutingApi.AddGroup, group);
  }

  sendMessage(groupCode: string, message: any) {
    return this.http.post(AppRoutingApi.SendMessage, message, {
      params: {
        groupCode: groupCode == null ? "" : groupCode
      }
    });
  }

  getMessageByGroup(groupCode: any) {
    return this.http.get(AppRoutingApi.GetMessageByGroup + "/" + groupCode);
  }

  getMessageByContact(contactCode: string) {
    return this.http.get(AppRoutingApi.GetMessageByContact + "/" + contactCode);
  }

  downloadFileAttachment(path: string) {
    return this.http.get(
      AppRoutingApi.DownloadFile + "?key=" + path,
      {
        responseType: "blob",
      }
    );
  }

  updateGroupAvatar(group: any) {
    return this.http.put(AppRoutingApi.UpdateGroupAvatar, group);
  }
}
