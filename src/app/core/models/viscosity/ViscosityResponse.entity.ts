import { AdminResponseEntity } from "../admin";

export interface ViscosityResponseEntity{
    id: number;
    description: string;
    admin: AdminResponseEntity;
}