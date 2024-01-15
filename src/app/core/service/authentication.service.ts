import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AppRoutingApi } from 'src/app/app-routing-api';
import { Constants } from '../util/constants';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    constructor(private http: HttpClient) { }

    get getToken(): string | null {
        return localStorage.getItem(Constants.LOCAL_STORAGE_KEY.TOKEN)?.toString() ?? null;
    }

    get currentUserValue(): any {
        let session = localStorage.getItem(Constants.LOCAL_STORAGE_KEY.SESSION);
        if (session == null || session == undefined) return null;
        return JSON.parse(
            localStorage.getItem(Constants.LOCAL_STORAGE_KEY.SESSION)?.toString() ?? ""
        );
    }

    login(prms: any) {
        return this.http.post(AppRoutingApi.Login, prms).pipe(
            map((resp: any) => {
                localStorage.setItem(Constants.LOCAL_STORAGE_KEY.SESSION, resp["data"]);
                localStorage.setItem(Constants.LOCAL_STORAGE_KEY.TOKEN, JSON.parse(resp["data"])["Token"]);
                return resp;
            })
        );
    }

    signUp(prms: any) {
        return this.http.post(AppRoutingApi.SignUp, prms);
    }
}
