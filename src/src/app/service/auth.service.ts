import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAdminSubject = new BehaviorSubject<boolean>(this.getAdminStatus());
  isAdmin$ = this.isAdminSubject.asObservable();

  getAdminStatus(): boolean {
    return localStorage.getItem('isAdmin') === 'true';
  }

  setAdminStatus(isAdmin: boolean) {
    localStorage.setItem('isAdmin', isAdmin ? 'true' : 'false');
    this.isAdminSubject.next(isAdmin);
  }

  logout() {
    localStorage.clear();
    this.isAdminSubject.next(false);
  }
}
