import { CredentialResponseEntity } from "../credential";

export interface AdminResponseEntity{
    id: number;
    name: string;
    credential: CredentialResponseEntity;
}