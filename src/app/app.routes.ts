import { Routes } from '@angular/router';

//Imports for the Sellers Components
import { FeedbackDiscountComponent } from './commerce/UI/feedback-discount/feedback-discount.component';
import { RedeemDiscountComponent } from './commerce/UI/redeem-discount/redeem-discount.component';
import { RegisterRtComponent } from './commerce/UI/register-rt/register-rt.component';
import { UserLoginComponent } from './commerce/auth/user-login/user-login.component';
import { LobbyComponent } from './commerce/UI/lobby/lobby.component';

//Imports for the Admin Components
import { SectionProductsComponent } from './admin/UI/section-products/section-products.component';
import { SectionDownloadComponent } from './admin/UI/section-download/section-download.component';
import { SectionStoreComponent } from './admin/UI/section-store/section-store.component';
import { AdminLoginComponent } from './admin/auth/admin-login/admin-login.component';
import { LobbyAdminComponent } from './admin/UI/lobby-admin/lobby-admin.component';
import { ForgotPasswordComponent } from './commerce/auth/forgot-password/forgot-password.component';

export const routes: Routes = [
    {
        path: 'commerce',
        children: [
            {
                path: 'login',
                component: UserLoginComponent
            },
            {
                path: 'forgot-password',
                component: ForgotPasswordComponent
            },
            {
                path: 'lobby',
                component: LobbyComponent
            },
            {   
                path: 'feedback',
                component: FeedbackDiscountComponent
            },
            {   
                path: 'reedem',
                component: RedeemDiscountComponent
            },
            {
                path: 'registerrt',
                component: RegisterRtComponent
            },
            {
                path: '**',
                redirectTo: 'login'
            }
        ]
    },
    {
        path: 'admin',
        children: [
            {
                path: 'login',
                component: AdminLoginComponent
            },
            {
                path: 'lobby-admin',
                component: LobbyAdminComponent
            },
            {
                path: 'download',
                component: SectionDownloadComponent
            },
            {
                path: 'products',
                component: SectionProductsComponent
            },
            {
                path: 'sellers',
                component: SectionStoreComponent
            },
            {
                path: '**',
                redirectTo: 'login'
            }
        ]
    },
    {
        path: '',
        redirectTo: 'commerce',
        pathMatch: 'full'
    },
    { 
        path: '**',
        redirectTo: 'commerce',
    }
];