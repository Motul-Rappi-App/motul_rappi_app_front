import { RappiCourierResponseEntity } from "../rappiCourier";

export interface ValidatePromotionResponseEntity {
    isValidPromotion: boolean;
    messageInformation: string;
    doRegisterIn: string | null;
    rappiCourierDto: RappiCourierResponseEntity | null;
    identification: string;
}