import { User } from "./user";

export interface Message {
    Id: number;
    Type: string;
    GroupCode: string;
    Content: string;
    Path: string;
    Created: Date;
    CreatedBy: string;

    SendTo: string;
    UserCreatedBy: User;
}
