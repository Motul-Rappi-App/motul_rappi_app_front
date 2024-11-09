import { AdminResponseEntitie } from "../admin";
import { LocationResponseEntitie } from "../location";

export interface CommerceResponseEntitie {
    id: number;
    NIT: string;
    email: string;
    password: string;
    name: string;
    locationId: LocationResponseEntitie;
    adminId: AdminResponseEntitie;
    inscriptionDate: Date;
}