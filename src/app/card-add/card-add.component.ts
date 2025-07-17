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
    this.expirationDate =
      raw.length >= 3 ? `${raw.slice(0, 2)}/${raw.slice(2)}` : raw;
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
          this.toastr.success('Visa card saved and subscription confirmed! ✅');
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
}
