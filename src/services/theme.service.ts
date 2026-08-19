
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode = signal<boolean>(true); // Default to dark mode

  constructor() {
    // You could load the preference from localStorage here
  }

  toggleDarkMode() {
    this.isDarkMode.update(value => !value);
  }

  // Branding could be extended here
  getBranding() {
    return {
      logoUrl: './assets/logo.svg', // Placeholder
      appName: 'AI Console'
    };
  }
}
