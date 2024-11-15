import { jwt } from '../models';
import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JwtLocalManageService {

  constructor(private _toastr: ToastrService) { }

  get tokenFromLocal(): jwt | null{
    if( localStorage.getItem("token") ) return {token: JSON.parse( localStorage.getItem("token")!) }
    return null
  }
  
  deleteTokenFromLocal(): boolean {  
    const localToken = localStorage.getItem("token")

    if(!localToken) throw new Error('No token found in LocalStorage')

    try {
      localStorage.removeItem("token")
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  setTokenToLocal(tokenToSave: string): jwt | null {
    try {
      localStorage.setItem("token", JSON.stringify(tokenToSave))
      const token = JSON.parse( localStorage.getItem("token")! )

      if(!token) throw new Error('Token not saved')

      return {token}
    } catch (error) {

      console.error(error)
      return null
    }
  }

  get tokenInHeaders(){
    try {
      const token = this.tokenFromLocal?.token

      if( !token ) throw new Error('No token found in Headers')

      return new HttpHeaders({ 'Authorization': 'Bearer ' + token })
    } catch (error) {
      
      console.error(error)
      return null
    }
  }
}