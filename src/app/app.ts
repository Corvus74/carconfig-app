import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {CarConfigMain} from './core/view/car-config-main/car-config-main';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CarConfigMain],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('carconfig-app');
}
