import {
  ApplicationConfig, isDevMode, LOCALE_ID,
  provideBrowserGlobalErrorListeners, provideZoneChangeDetection
} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {provideApi} from '@carconfig/api-client';
import { provideTransloco } from '@jsverse/transloco';
import { TranslocoHttpLoader } from './transloco-loader';
import { authInterceptor } from '@carconfig/auth';
import { mockApiInterceptor, RUNTIME_CONFIG, RuntimeConfig } from '@carconfig/shared';



/**
 * Factory function to provide the runtime configuration.
 * It reads the configuration from the global `window.env` object,
 * which is created by the `env.js` script at container startup.
 */
export function provideRuntimeConfig(): RuntimeConfig {
  // Send API requests through the Angular dev-server proxy. This keeps the
  // browser same-origin and lets ng serve reach a backend running in Docker.
  if (isDevMode()) {
    console.log('Running in development mode, using proxy for API calls.');
    const appOrigin = window.location.origin;
    return { apiBaseUrl: '/api', apiOrderUrl: `${appOrigin}/order`, apiProductViewUrl: `${appOrigin}/product` };
  }

  // For production (Docker), read from the injected env.js
  const env = (window as any).env;

  // A simple check to see if the global env object and its properties are available.
  const runtimeVarsAvailable = env?.apiUrl && env.apiOrderUrl && env.apiProductViewUrl;

  if (!runtimeVarsAvailable) {
    console.error('ERROR: Runtime environment variables from env.js are not available!');
    throw new Error('Runtime environment variables from env.js are not available.');
  }

  return {
    apiBaseUrl: env.apiUrl,
    apiOrderUrl: env.apiOrderUrl,
    apiProductViewUrl: env.apiProductViewUrl
  };
}


export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([mockApiInterceptor, authInterceptor])),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideApi(provideRuntimeConfig().apiBaseUrl),
    {provide: RUNTIME_CONFIG, useFactory: provideRuntimeConfig},
    {provide: LOCALE_ID, useValue: 'en-GB'},
    provideTransloco({
      config: {
        availableLangs: ['de', 'en'],
        defaultLang: 'en',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
  ]
};
