import {inject, Injectable} from '@angular/core';
import {RUNTIME_CONFIG, RuntimeConfig} from '../../app.config';

@Injectable({
  providedIn: 'root'
})
export class CarConfigApiService {

  private readonly config: RuntimeConfig = inject(RUNTIME_CONFIG);

  // 2. Use the base URL from the injected config
  private readonly apiUrl = this.config.apiBaseUrl;
  private readonly apiOrderUrl = this.config.apiOrderUrl;

  constructor() {
    console.log(`API Service initialized with URL: ${this.apiUrl}`);
  }

  public getApiOrderUrl(){
    return this.apiOrderUrl;
  }

}
