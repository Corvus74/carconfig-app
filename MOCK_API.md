# Frontend mit Mock-API entwickeln

Die Mock-API läuft vollständig im Browser. Sie fängt die vorhandenen OpenAPI-HTTP-Aufrufe ab; ein Backend oder zusätzlicher Port ist nicht erforderlich.

1. Starte die Angular-Entwicklungsversion.
2. Öffne die Browser-Konsole und aktiviere Mocks mit:

   ```js
   localStorage.setItem('carconfig:mockApi', 'true');
   location.reload();
   ```

3. Öffne `/login` und melde dich mit beliebiger E-Mail-Adresse und beliebigem Passwort an. Der Mock akzeptiert jede Eingabe.
4. Konfiguriere ein Fahrzeug und lege eine Bestellung an. Mock-Bestellungen werden im Local Storage unter `carconfig:mockOrders` gespeichert und überstehen einen Reload.

Zum Wechsel auf das echte Backend:

```js
localStorage.removeItem('carconfig:mockApi');
localStorage.removeItem('carconfig:mockOrders'); // optional: lokale Mock-Bestellungen löschen
location.reload();
```

Die Beispieldaten und die unterstützten Endpunkte liegen im `mockApiInterceptor` unter `projects/shared/src/lib/`.

## Echtes Backend im Container live testen

Die Angular-Entwicklungsserver-Anfragen laufen über `/api` und werden serverseitig weitergeleitet. Dadurch muss der Browser keinen direkten Cross-Origin-Aufruf zum Backend machen.

1. Das Backend muss vom Host unter Port `8090` erreichbar sein. Wenn sein Container intern z. B. Port `8080` nutzt, veröffentliche ihn mit `8090:8080`.
2. Im Dev Container ist `CARCONFIG_API_TARGET` auf `http://host.docker.internal:8090` gesetzt. Bei einer bereits geöffneten Dev-Container-Sitzung die Container-Konfiguration einmal neu laden oder im Terminal setzen:

   ```sh
   export CARCONFIG_API_TARGET=http://host.docker.internal:8090
   npm start
   ```

   Wenn du `npm start` direkt auf Windows ausführst, reicht `http://localhost:8090`; der Proxy verwendet das als Standard.
3. Entferne im Browser die Mock-Aktivierung, falls sie zuvor gesetzt wurde:

   ```js
   localStorage.removeItem('carconfig:mockApi');
   location.reload();
   ```

Wenn Frontend- und Backend-Container im selben Docker-Netzwerk sind, kann `CARCONFIG_API_TARGET` stattdessen auf den Backend-Service-Namen und dessen internen Port zeigen, z. B. `http://backend:8080`.

Der Proxy leitet nur `/api` weiter. Die Browser-Routen `/order/...` und `/product/...` bleiben beim Angular-Frontend, damit geteilte Konfigurationen in der App geöffnet werden.
