import { environment } from "src/environments/environment";

export class AppRoutingApi {
    static Login = environment.apiUrl + "auths/login";
    static SignUp = environment.apiUrl + "auths/sign-up";
    static PostHubConnection = environment.apiUrl + "post-hubconnection";
    static DownloadFile = environment.apiUrl + "file";

    static GetChatHistory = environment.apiUrl + "chatBoards/get-history";
    static GetChatBoardInfo = environment.apiUrl + "chatBoards/get-info";
    static AddGroup = environment.apiUrl + "chatBoards/groups";
    static SendMessage = environment.apiUrl + "chatBoards/send-message";
    static GetMessageByGroup = environment.apiUrl + "chatBoards/get-message-by-group";
    static GetMessageByContact = environment.apiUrl + "chatBoards/get-message-by-contact";
    static UpdateGroupAvatar = environment.apiUrl + "chatBoards/update-group-avatar";

    static GetCallHistory = environment.apiUrl + "calls/get-history";
    static GetCallHistoryById = environment.apiUrl + "calls/get-history";
    static Call = environment.apiUrl + "calls/call";
    static JoinVideoCall = environment.apiUrl + "calls/join-video-call";
    static CancelVideoCall = environment.apiUrl + "calls/cancel-video-call";

    static GetProfile = environment.apiUrl + "users/profile";
    static UpdateProfile = environment.apiUrl + "users/profile";
    static GetContact = environment.apiUrl + "users/contacts";
    static SearchContact = environment.apiUrl + "users/contacts/search";
    static AddContact = environment.apiUrl + "users/contacts";
}
