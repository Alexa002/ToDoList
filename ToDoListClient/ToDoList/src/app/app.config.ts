import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideNativeDateAdapter } from '@angular/material/core';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    // Routing
    provideRouter(routes),

    // Zone-based change detection
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Angular Material animations
    provideAnimations(),

    // Material Date Adapter
    provideNativeDateAdapter(),

    // HttpClient with interceptors
    provideHttpClient(withInterceptors([authInterceptor])),


    
  ]
};
