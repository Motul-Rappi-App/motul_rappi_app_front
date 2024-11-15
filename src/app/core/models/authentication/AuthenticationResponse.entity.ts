import { AdminResponseEntity } from "../admin";
import { CommerceResponseEntity } from "../commerce";

export interface AuthenticationResponseEntity{
    token: string;
    admin: AdminResponseEntity | null;
    commerce: CommerceResponseEntity | null;
}