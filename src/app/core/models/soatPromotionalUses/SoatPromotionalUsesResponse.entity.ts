import { CommerceResponseEntity } from "../commerce";
import { OilReferenceResponseEntity } from "../oilReference";
import { ViscosityResponseEntity } from "../viscosity";

export interface SoatPromotionalUsesResponseEntity{
    id: number;
    identification: string;
    commerce: CommerceResponseEntity;
    oilReference: OilReferenceResponseEntity;
    viscosity: ViscosityResponseEntity;
    quantityLiters: number;
    registerDate: Date;
}