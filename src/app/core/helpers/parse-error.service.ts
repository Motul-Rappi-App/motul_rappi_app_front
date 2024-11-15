import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParseErrorService {

  constructor() { }

  parseErrorFromBackend(error: any): string{
    return Object.values(error.error) + "".replace(/["[\]]/g, '')
  }
}
