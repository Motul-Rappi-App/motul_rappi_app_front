import { AdminResponseEntitie } from "../admin";
import { LocationResponseEntitie } from "../location";

export interface CommerceResponseEntitie {
[x: string]: any;
    id: number;
    nit: string;
    email: string;
    password: string;
    name: string;
    locationId: LocationResponseEntitie; 
    adminId: AdminResponseEntitie;      
    inscriptionDate: Date;
}