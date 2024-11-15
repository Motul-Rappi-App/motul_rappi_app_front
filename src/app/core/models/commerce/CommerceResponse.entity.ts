import { AdminResponseEntity } from "../admin";
import { CredentialResponseEntity } from "../credential";
import { LocationResponseEntity } from "../location";

export interface CommerceResponseEntity {
    id: number;
    nit: string;
    name: string;
    credential: CredentialResponseEntity;
    location: LocationResponseEntity;
    admin: AdminResponseEntity;
    inscriptionDate: Date;
}