import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(FormsModule),
    provideAnimations(),
    provideToastr({
      timeOut: 5000,
      positionClass: 'toast-top-right', // ✅ Ensure this is set to a corner position
      preventDuplicates: true,
      progressBar: true,
      closeButton: true,
      newestOnTop: true,
      tapToDismiss: true,
      toastClass: 'ngx-toastr',
      iconClasses: {
        error: 'toast-error',
        info: 'toast-info',
        success: 'toast-success',
        warning: 'toast-warning',
      },
    }),
  ]
};
