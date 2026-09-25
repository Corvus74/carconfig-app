import { inject, Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

@Injectable({
  providedIn: 'root'
})
export class GeneralFunctionsService {
  private readonly transloco = inject(TranslocoService);

  public formatCurrency(priceInCt:number){
    const priceInCurrency = priceInCt / 100;
    const locale = this.transloco.getActiveLang() === 'de' ? 'de-DE' : 'en-GB';
    return new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(priceInCurrency);
  }


}
