import { inject, Service, signal } from '@angular/core';
import { BaseConfigDto, ConfigWebControllerService } from '@carconfig/api-client';
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
    // Avoid duplicate requests while data is cached or a request is in progress.
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
