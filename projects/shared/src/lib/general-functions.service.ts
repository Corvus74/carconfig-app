import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeneralFunctionsService {
  public formatCurrency(priceInCt:number){
    const priceInCurrency = priceInCt / 100;
    const locale = typeof document !== 'undefined' && document.documentElement.lang === 'de' ? 'de-DE' : 'en-GB';
    return new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(priceInCurrency);
  }


}
