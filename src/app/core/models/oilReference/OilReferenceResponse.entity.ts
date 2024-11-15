import { AdminResponseEntity } from "../admin";
import { ViscosityResponseEntity } from "../viscosity";

export interface OilReferenceResponseEntity{
    id: number;
    name: string;
    viscosities: ViscosityResponseEntity[];
    admin: AdminResponseEntity;
}