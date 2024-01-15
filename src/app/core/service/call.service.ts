import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppRoutingApi } from 'src/app/app-routing-api';

@Injectable({
  providedIn: 'root'
})
export class CallService {
  constructor(private http: HttpClient) { }

  getCallHistory() {
    return this.http.get(AppRoutingApi.GetCallHistory);
  }

  getCallHistoryById(key: string) {
    return this.http.get(AppRoutingApi.GetCallHistoryById + "/" + key);
  }

  call(callTo: string) {
    return this.http.get(AppRoutingApi.Call + "/" + callTo);
  }

  joinVideoCall(url: string) {
    return this.http.get(AppRoutingApi.JoinVideoCall, {
      params: {
        url
      }
    });
  }

  cancelVideoCall(url: string) {
    return this.http.get(AppRoutingApi.CancelVideoCall, {
      params: {
        url
      }
    });
  }
}
