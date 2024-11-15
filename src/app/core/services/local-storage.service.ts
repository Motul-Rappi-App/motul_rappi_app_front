import { Injectable } from '@angular/core';

import { AuthenticationResponseEntity } from '../models/authentication/AuthenticationResponse.entity';
import { AdminResponseEntity, CommerceResponseEntity } from '../models';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  getAdminIdFromStorage(): number | null {
    try {
        const adminCredentials = this.credentialFromLocal;
        if (adminCredentials) return adminCredentials.id || null;
        else throw new Error('No credentials found in Local');
      }
    catch (error) {
        console.error("Error returning admin credentials from LocalStorage:", error);
        return null;
    }
  }

  getCommerceIdFromStorage(): number | null {
    try {
        const commerceCredentials = this.credentialFromLocal;
        if (commerceCredentials) return commerceCredentials.id || null;
        else throw new Error('No credentials found in Local');
      }
    catch (error) {
        console.error("Error returning admin credentials from LocalStorage:", error);
        return null;
    }
  }

  private get credentialFromLocal(): AdminResponseEntity | CommerceResponseEntity | null{

    if( localStorage.getItem("credential") ){
      const credentialsFromLocal = JSON.parse( localStorage.getItem("credential")!);
      return credentialsFromLocal.admin || credentialsFromLocal.commerce;
    }
    return null
  }
  
  deleteCredentialsFromLocal(): boolean {  
    const credential = localStorage.getItem("credential")

    if(!credential) throw new Error('No credentials found in LocalStorage')

    try {
      localStorage.removeItem("credential")
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  setCredentialsToLocal(credentialsToSave: AuthenticationResponseEntity): AuthenticationResponseEntity | null {
    try {
      localStorage.setItem("credential", JSON.stringify(credentialsToSave))
      const credentials = JSON.parse( localStorage.getItem("credential")! )

      if(!credentials) throw new Error('Credentials not saved')

      return credentials.admin || credentials.commerce;
    } catch (error) {

      console.error(error)
      return null
    }
  }
}
