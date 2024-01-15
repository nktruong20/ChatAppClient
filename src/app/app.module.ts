import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from "@angular/common/http";
import { NgxSpinnerModule } from "ngx-spinner";
import { ToastrModule } from "ngx-toastr";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './containers/login/login.component';
import { LogoutComponent } from './containers/logout/logout.component';
import { SignUpComponent } from './containers/sign-up/sign-up.component';
import { HomeComponent } from './containers/home/home.component';
import { PageNotFoundComponent } from './containers/page-not-found/page-not-found.component';
import { ListCallComponent } from './containers/home/template/call/list-call/list-call.component';
import { CallDetailComponent } from './containers/home/template/call/call-detail/call-detail.component';
import { ListContactComponent } from './containers/home/template/contact/list-contact/list-contact.component';
import { ContactDetailComponent } from './containers/home/template/contact/contact-detail/contact-detail.component';
import { ListMessageComponent } from './containers/home/template/message/list-message/list-message.component';
import { MessageDetailComponent } from './containers/home/template/message/message-detail/message-detail.component';
import { ListNotificationComponent } from './containers/home/template/notification/list-notification/list-notification.component';
import { NotificationDetailComponent } from './containers/home/template/notification/notification-detail/notification-detail.component';
import { DefaultComponent } from './containers/home/template/default/default.component';
import { AuthGuardService } from "./auth/auth-guard.service";
import { ErrorInterceptor } from "./auth/error.interceptor";
import { JwtInterceptor } from "./auth/jwt.interceptor";
import { ChatDatePipe } from './core/pipe/chat-date.pipe';
import { ButtonUploadComponent } from './components/button-upload/button-upload.component';
import { PipeHostFilePipe } from './core/pipe/pipe-host-file.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LogoutComponent,
    SignUpComponent,
    HomeComponent,
    PageNotFoundComponent,
    ListCallComponent,
    CallDetailComponent,
    ListContactComponent,
    ContactDetailComponent,
    ListMessageComponent,
    MessageDetailComponent,
    ListNotificationComponent,
    NotificationDetailComponent,
    DefaultComponent,
    ChatDatePipe,
    ButtonUploadComponent,
    PipeHostFilePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    AuthGuardService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
