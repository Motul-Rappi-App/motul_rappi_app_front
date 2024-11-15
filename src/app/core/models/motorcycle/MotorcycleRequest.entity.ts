export interface MotorcycleRequestEntity{
    brand: string;
    cylinderCapacity: string;
    year: string;
    motorStroke:  "TWO_STROKE" | "FOUR_STROKE";
    reference: string;
}