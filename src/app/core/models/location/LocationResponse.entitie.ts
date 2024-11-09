import { AdminResponseEntitie } from "../admin";

export interface LocationResponseEntitie{
    id: number;
    name: string;
    admin: AdminResponseEntitie;
}