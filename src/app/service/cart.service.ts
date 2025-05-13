import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CartService {
  private hasItemsSubject = new BehaviorSubject<boolean>(false);
  hasItems$ = this.hasItemsSubject.asObservable();

  constructor(private http: HttpClient) {}

  checkCart(userId: string) {
    if (!userId) return;
    this.http.get<any>(`http://localhost:3000/api/cart/${userId}`).subscribe({
      next: (cart) => {
        this.hasItemsSubject.next(cart?.items?.length > 0);
      },
      error: () => this.hasItemsSubject.next(false),
    });
  }

  setCartState(state: boolean) {
    this.hasItemsSubject.next(state);
  }
}
