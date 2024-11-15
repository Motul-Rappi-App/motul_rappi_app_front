import { AdminResponseEntity } from "../admin";

export interface LocationResponseEntity{
    id: number;
    name: string;
    admin: AdminResponseEntity;
}