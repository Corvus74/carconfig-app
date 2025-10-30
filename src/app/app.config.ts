import {
  ApplicationConfig, InjectionToken, isDevMode, LOCALE_ID,
  provideBrowserGlobalErrorListeners, provideZoneChangeDetection
} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient} from '@angular/common/http';
import {provideApi} from './core/api';


// This is your shared service that will hold the config
export interface RuntimeConfig {
  apiBaseUrl: string;
  apiOrderUrl: string;
  apiProductViewUrl: string;
  // Add other runtime variables here if needed
}

export const RUNTIME_CONFIG = new InjectionToken<RuntimeConfig>('RUNTIME_CONFIG');

/**
 * Factory function to provide the runtime configuration.
 * It reads the configuration from the global `window.env` object,
 * which is created by the `env.js` script at container startup.
 */
export function provideRuntimeConfig(): RuntimeConfig {
  // For local development, the API base URL should be an empty string
  // so that requests are sent to the same origin (e.g., /api/...). The Angular
  // dev server's proxy will then forward these requests to the backend.
  if (isDevMode()) {
    console.log('Running in development mode, using proxy for API calls.');
    // Use relative paths so that the proxy can intercept the requests.
    return { apiBaseUrl: 'http://localhost:8090/api', apiOrderUrl: 'http://localhost:4200/order', apiProductViewUrl: 'http://localhost:4200/product' };
  }

  // For production (Docker), read from the injected env.js
  const env = (window as any).env;

  // A simple check to see if the global env object and its properties are available.
  const runtimeVarsAvailable = env && env.apiUrl && env.apiOrderUrl && env.apiProductViewUrl;

  if (!runtimeVarsAvailable) {
    console.error('ERROR: Runtime environment variables from env.js are not available!');
    // Provide a sensible default or throw an error to fail fast
    return { apiBaseUrl: 'http://error.invalid/api', apiOrderUrl: 'http://error.invalid/order', apiProductViewUrl: 'http://error.invalid/product' };
  }

  return {
    apiBaseUrl: env.apiUrl,
    apiOrderUrl: env.apiOrderUrl,
    apiProductViewUrl: env.apiProductViewUrl
  };
}


export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideApi(provideRuntimeConfig().apiBaseUrl),
    {provide: RUNTIME_CONFIG, useFactory: provideRuntimeConfig},
    {provide: LOCALE_ID, useValue: 'de-DE'}

  ]
};
