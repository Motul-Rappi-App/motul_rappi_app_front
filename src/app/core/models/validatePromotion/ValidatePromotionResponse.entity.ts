import { RappiCourierResponseEntity } from "../rappiCourier";

export interface ValidatePromotionResponseEntity {
    validPromotion: boolean;
    messageInformation: string;
    doRegisterIn: string | null;
    rappiCourierDto: RappiCourierResponseEntity | null;
    identification: string;
}