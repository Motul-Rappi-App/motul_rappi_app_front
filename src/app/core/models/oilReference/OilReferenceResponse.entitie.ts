import { AdminResponseEntitie } from "../admin";
import { ViscosityResponseEntitie } from "../viscosity";

export interface OilReferenceResponseEntitie{
    id: number;
    name: string;
    viscosities: ViscosityResponseEntitie[];
    admin: AdminResponseEntitie;
}