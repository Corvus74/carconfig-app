import {
  ApplicationConfig, inject, InjectionToken, LOCALE_ID, provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient} from '@angular/common/http';


// This is your shared service that will hold the config
export interface RuntimeConfig {
  apiBaseUrl: string;
  featureFlags?: Record<string, boolean>;
}

export const RUNTIME_CONFIG = new InjectionToken<RuntimeConfig>('RUNTIME_CONFIG');

let runtimeConfig!: RuntimeConfig;
function loadRuntimeConfig(): Promise<void> {
  return fetch('/assets/runtime-config.json', { cache: 'no-store' })
    .then(resp => {
      if (!resp.ok) throw new Error(`Failed to load runtime-config.json: ${resp.status}`);
      return resp.json() as Promise<RuntimeConfig>;
    })
    .then(cfg => { runtimeConfig = cfg; });
}


export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAppInitializer(() => loadRuntimeConfig()),

    { provide: RUNTIME_CONFIG, useValue: runtimeConfig },
    { provide: LOCALE_ID, useValue: 'de-DE'}
  ]
};
