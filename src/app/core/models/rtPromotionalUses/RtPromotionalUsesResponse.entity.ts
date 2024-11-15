import { CommerceResponseEntity } from "../commerce";
import { OilReferenceResponseEntity } from "../oilReference";
import { RappiCourierResponseEntity } from "../rappiCourier";
import { ViscosityResponseEntity } from "../viscosity";

export interface RtPromotionalUsesResponseEntity{
    id: number;
    rappiCourier: RappiCourierResponseEntity;
    commerce: CommerceResponseEntity;
    oilReference: OilReferenceResponseEntity;
    viscosity: ViscosityResponseEntity;
    quantityLiters: number;
    registerDate: Date;
}