import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient, private router: Router) {}

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
      alert('❌ Invalid card number. Format should be: 1234 5678 9012 3456');
      return;
    }

    if (!namePattern.test(this.cardName.toUpperCase())) {
      alert('❌ Invalid name. Please use uppercase letters and spaces only.');
      return;
    }

    if (!expirationPattern.test(this.expirationDate)) {
      alert('❌ Invalid expiration date. Format should be: MM/YY');
      return;
    }

    if (!securityCodePattern.test(this.securityCode)) {
      alert('❌ Invalid CVV. It must be exactly 3 digits.');
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
          alert('✅ Visa card saved and subscription confirmed!');
          this.isSubscribed = true;
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('❌ Visa save failed:', err);
          alert('❌ Could not save card. Try again.');
        },
      });
    } catch (err) {
      console.error('❌ Error checking Visa card:', err);
      alert('❌ Failed to check existing card. Please try again.');
    }
  }
}
