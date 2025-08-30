import { Injectable } from '@angular/core';
import {formatCurrency} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CarConfigGeneralFunctionsService {

  public formatCurrency(priceInCt:number){
    let priceInCurrency = priceInCt/100;
    return formatCurrency(priceInCurrency,"de","€","EUR");
  }


}
