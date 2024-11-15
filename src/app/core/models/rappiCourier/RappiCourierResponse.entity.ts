import { CommerceResponseEntity } from "../commerce";
import { MotorcycleResponseEntity } from "../motorcycle";

export interface RappiCourierResponseEntity{
    id: number;
    identification: string;
    fullName: string;
    rappiToken: string;
    commerce: CommerceResponseEntity;
    inscriptionDate: Date;
    motorcycle: MotorcycleResponseEntity;
}