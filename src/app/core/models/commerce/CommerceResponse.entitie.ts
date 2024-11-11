import { AdminResponseEntitie } from "../admin";
import { LocationResponseEntitie } from "../location";

export interface CommerceResponseEntitie {
    id: number;
    nit: string;
    email: string;
    password: string;
    name: string;
    location: LocationResponseEntitie;  // Cambiado de locationId a location
    admin: AdminResponseEntitie;        // Cambiado de adminId a admin
    inscriptionDate: Date;
}