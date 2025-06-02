import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-card-info',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './card-info.component.html',
  styleUrls: ['./card-info.component.css']
})
export class CardInfoComponent {
  cardNumber: string = '';
  cardName: string = '';
  expirationDate: string = '';
  securityCode: string = '';
  isFlipped: boolean = false;
  isSubscribed: boolean = false; // subscription flag

  email: string = '';

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
    if (this.svgName) this.svgName.nativeElement.textContent = name.toUpperCase();
    if (this.svgNameBack) this.svgNameBack.nativeElement.textContent = name;
  }

  formatCardNumber(event: any) {
    let raw = this.cardNumber.replace(/\D/g, '').substring(0, 16);
    const groups = raw.match(/.{1,4}/g);
    const formatted = groups ? groups.join(' ') : '';
    this.cardNumber = formatted;
    if (this.svgNumber) this.svgNumber.nativeElement.textContent = formatted.padEnd(19, '•');
  }

  formatExpirationDate(event: any) {
    let raw = this.expirationDate.replace(/\D/g, '').substring(0, 4);
    if (raw.length >= 3) {
      this.expirationDate = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    } else {
      this.expirationDate = raw;
    }
    if (this.svgExpire) {
      this.svgExpire.nativeElement.textContent = this.expirationDate.padEnd(5, '•');
    }
  }

  formatSecurityCode(event: any) {
    let raw = this.securityCode.replace(/\D/g, '').substring(0, 3);
    this.securityCode = raw;
    if (this.svgSecurity) {
      this.svgSecurity.nativeElement.textContent = raw.padEnd(3, '•');
    }
  }

  generateRandomCard() {
    let digits = '';
    for (let i = 0; i < 16; i++) {
      digits += Math.floor(Math.random() * 10);
    }
    const formatted = digits.match(/.{1,4}/g)?.join(' ') ?? '';
    this.cardNumber = formatted;
    if (this.svgNumber) this.svgNumber.nativeElement.textContent = formatted;
  }

  flipCard(flip: boolean) {
    this.isFlipped = flip;
  }

  onPay() {
    const cardNumberPattern = /^\d{4} \d{4} \d{4} \d{4}$/;
    const namePattern = /^[A-Z][A-Z\s]{1,25}$/; // Basic name validation (uppercase)
    const expirationPattern = /^(0[1-9]|1[0-2])\/\d{2}$/; // MM/YY format
    const securityCodePattern = /^\d{3}$/;

    const isCardNumberValid = cardNumberPattern.test(this.cardNumber);
    const isNameValid = namePattern.test(this.cardName.toUpperCase());
    const isExpirationValid = expirationPattern.test(this.expirationDate);
    const isSecurityCodeValid = securityCodePattern.test(this.securityCode);

    if (!isCardNumberValid) {
      alert('❌ Invalid card number. Format should be: 1234 5678 9012 3456');
      return;
    }

    if (!isNameValid) {
      alert('❌ Invalid name. Please use uppercase letters and spaces only.');
      return;
    }

    if (!isExpirationValid) {
      alert('❌ Invalid expiration date. Format should be: MM/YY');
      return;
    }

    if (!isSecurityCodeValid) {
      alert('❌ Invalid CVV. It must be exactly 3 digits.');
      return;
    }

    // Prepare subscription data including the email
    const subscriptionData = {
      email: this.email,
      cardNumber: this.cardNumber,
      cardName: this.cardName,
      expirationDate: this.expirationDate,
      securityCode: this.securityCode
    };

    this.http.post('http://localhost:3000/api/subscribe', subscriptionData).subscribe({
      next: (response) => {
        alert('✅ Payment submitted successfully and subscription activated!');
        this.isSubscribed = true;
        this.router.navigate(['/']); // Navigate to index page
      },
      error: (error) => {
        console.error('Subscription failed:', error);
        alert('❌ Subscription failed. Please try again.');
      }
    });
  }
}
