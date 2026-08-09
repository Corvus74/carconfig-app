import { inject, Service, signal } from '@angular/core';
import { BaseConfigDto, ConfigWebControllerService } from '../api';
import { firstValueFrom } from 'rxjs';

@Service()
export class CarConfigFacadeService {

    private readonly configApi = inject(ConfigWebControllerService);

    private readonly _baseConfig = signal<BaseConfigDto | null>(null);
  readonly baseConfig = this._baseConfig.asReadonly();

  // Sicherheits-Flag, um Mehrfach-Aufrufe zu blockieren
  private isInitialLoading = false;

  // Sonar-konforme, asynchrone Methode (weder Constructor noch computed Seiteneffekt)
  async loadBaseConfig(): Promise<void> {
    // Wenn Daten da sind oder der Request läuft, blockieren wir sofort (Strikt 1x Laden)
    if (this._baseConfig() !== null || this.isInitialLoading) {
      return;
    }

    this.isInitialLoading = true;
    try {
      const config = await firstValueFrom(this.configApi.getBaseConfiguration());
      this._baseConfig.set(config); // Triggert die Change Detection garantiert!
    } catch (error) {
      console.error('Error fetching Base Configuration:', error);
    } finally {
      this.isInitialLoading = false;
    }
  }
}

