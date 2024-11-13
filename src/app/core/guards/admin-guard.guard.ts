import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { JwtLocalManageService } from '../services/jwt-local-manage.service';

export const AdminGuard = () => {

    const jwtServ = inject(JwtLocalManageService);
    const authServ = inject(AuthService);
    const router = inject(Router);

    const token = jwtServ.tokenFromLocal;
    const tokenObservable = authServ.checkToken();

    if (token && tokenObservable) {
        return tokenObservable.pipe( map((response: any) => {
            if (response) {
                return true; // Permitir acceso
            }

            router.navigate(['/admin/login']); // Redirige si no tiene acceso
            return false;
        }),
        catchError((error) => {
            console.error('Error al verificar el token:', error);
            router.navigate(['/admin/login']); // Redirige a la página de login en caso de error
            return of(false);
        }));
    }

    router.navigate(['/commerce/login']);
    return false;
};
