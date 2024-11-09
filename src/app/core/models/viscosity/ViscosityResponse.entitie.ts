import { AdminResponseEntitie } from "../admin";

export interface ViscosityResponseEntitie{
    id: number;
    description: string;
    admin: AdminResponseEntitie;
}