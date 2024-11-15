export interface CredentialRequestEntity{
    email: string;
    password: string;
    userRole: "ADMIN_ROLE" | "COMMERCE_ROLE";
    adminId: number;
    commerceId: number;
}