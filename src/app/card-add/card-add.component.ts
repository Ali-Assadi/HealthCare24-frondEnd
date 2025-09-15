import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-card-add',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './card-add.component.html',
  styleUrls: ['./card-add.component.css'],
})
export class CardAddComponent {
  cardNumber = '';
  cardName = '';
  expirationDate = '';
  securityCode = '';
  isFlipped = false;
  isSubscribed = false;
  email = '';

  @ViewChild('svgnumber', { static: true }) svgNumber!: ElementRef;
  @ViewChild('svgname', { static: true }) svgName!: ElementRef;
  @ViewChild('svgnameback', { static: true }) svgNameBack!: ElementRef;
  @ViewChild('svgexpire', { static: true }) svgExpire!: ElementRef;
  @ViewChild('svgsecurity', { static: true }) svgSecurity!: ElementRef;

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.email = localStorage.getItem('userEmail') || '';
  }

  updateCardDisplay() {
    const name = this.cardName.trim() || 'JOHN DOE';
    this.svgName.nativeElement.textContent = name.toUpperCase();
    this.svgNameBack.nativeElement.textContent = name;
  }

  formatCardNumber() {
    const raw = this.cardNumber.replace(/\D/g, '').substring(0, 16);
    const groups = raw.match(/.{1,4}/g);
    const formatted = groups ? groups.join(' ') : '';
    this.cardNumber = formatted;
    this.svgNumber.nativeElement.textContent = formatted.padEnd(19, '•');
  }

  formatExpirationDate() {
    const raw = this.expirationDate.replace(/\D/g, '').substring(0, 4);
    let mm = raw.slice(0, 2);
    const yy = raw.slice(2);

    if (mm.length === 2) {
      const m = Math.max(1, Math.min(12, parseInt(mm, 10) || 0));
      mm = m.toString().padStart(2, '0');
    }

    this.expirationDate = yy ? `${mm}/${yy}` : mm;
    this.svgExpire.nativeElement.textContent = this.expirationDate.padEnd(
      5,
      '•'
    );
  }

  formatSecurityCode() {
    const raw = this.securityCode.replace(/\D/g, '').substring(0, 3);
    this.securityCode = raw;
    this.svgSecurity.nativeElement.textContent = raw.padEnd(3, '•');
  }

  flipCard(flip: boolean) {
    this.isFlipped = flip;
  }

  async onPay() {
    const cardNumberPattern = /^\d{4} \d{4} \d{4} \d{4}$/;
    const namePattern = /^[A-Z][A-Z\s]{1,25}$/;
    const expirationPattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
    const securityCodePattern = /^\d{3}$/;

    if (!cardNumberPattern.test(this.cardNumber)) {
      this.toastr.error(
        'Invalid card number. Format should be: 1234 5678 9012 3456',
        '❌ Invalid Card'
      );
      return;
    }

    if (!namePattern.test(this.cardName.toUpperCase())) {
      this.toastr.error(
        'Invalid name. Please use uppercase letters and spaces only.',
        '❌ Invalid Name'
      );
      return;
    }

    if (!expirationPattern.test(this.expirationDate)) {
      this.toastr.error(
        'Invalid expiration date. Format should be: MM/YY',
        '❌ Invalid Expiry'
      );
      return;
    }

    // 🔒 New: block expired cards (must be this month or later)
    if (!this.isValidExpiry(this.expirationDate)) {
      this.toastr.error(
        'Card is expired. Please use a future date.',
        '❌ Expired'
      );
      return;
    }

    if (!securityCodePattern.test(this.securityCode)) {
      this.toastr.error(
        'Invalid CVV. It must be exactly 3 digits.',
        '❌ Invalid CVV'
      );
      return;
    }

    const [month, year] = this.expirationDate.split('/');
    const payload = {
      cardHolderName: this.cardName.toUpperCase(),
      last4Digits: this.cardNumber.replace(/\s/g, '').slice(-4),
      expiryMonth: parseInt(month),
      expiryYear: 2000 + parseInt(year),
    };

    try {
      const res = await this.http
        .get<{ visaCard?: any }>(
          `http://localhost:3000/api/user/${this.email}/visa`
        )
        .toPromise();

      const visaExists = !!(res && res.visaCard);

      const url = `http://localhost:3000/api/user/${this.email}/visa`;
      const request$ = visaExists
        ? this.http.put(url, payload)
        : this.http.post(url, payload);

      request$.subscribe({
        next: () => {
          this.toastr.success('Visa card saved ✅');
          this.isSubscribed = true;
          this.router.navigate(['/cart']);
        },
        error: (err) => {
          console.error('❌ Visa save failed:', err);
          this.toastr.error('Could not save card. Try again.', '❌ Error');
        },
      });
    } catch (err) {
      console.error('❌ Error checking Visa card:', err);
      this.toastr.error(
        'Failed to check existing card. Please try again.',
        '❌ Network Error'
      );
    }
  }
  /** Valid if expiry (MM/YY) is this month or later. */
  private isValidExpiry(exp: string): boolean {
    const m = exp.match(/^(\d{2})\/(\d{2})$/);
    if (!m) return false;

    const mm = parseInt(m[1], 10);
    const yy = parseInt(m[2], 10);
    if (Number.isNaN(mm) || Number.isNaN(yy) || mm < 1 || mm > 12) return false;

    const now = new Date();
    const currYear = now.getFullYear(); // e.g. 2025
    const currMonth = now.getMonth() + 1; // 1..12
    const fullYear = 2000 + yy; // 20YY

    if (fullYear > currYear) return true;
    if (fullYear < currYear) return false;
    return mm >= currMonth; // same year → month must be >= current month
  }
}
