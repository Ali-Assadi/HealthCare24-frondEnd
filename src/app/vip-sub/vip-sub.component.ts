import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr'; // ✅ Import Toastr
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vip-sub',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './vip-sub.component.html',
  styleUrls: ['./vip-sub.component.css'],
})
export class vipSubComponent {
  cardNumber = '';
  cardName = '';
  expirationDate = '';
  securityCode = '';
  isFlipped = false;
  isSubscribed = false;
  email = '';
  hasVisa = false;
  visaCard: any = null;
  showVisaDialog = false;
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
    this.checkVisaCard();
  }

  checkVisaCard() {
    this.http
      .get<{ visaCard?: any }>(
        `http://localhost:3000/api/user/${this.email}/visa`
      )
      .subscribe({
        next: (res) => {
          if (res.visaCard) {
            this.hasVisa = true;
            this.visaCard = res.visaCard;
            this.showVisaDialog = true;
          }
        },
        error: () => {
          this.hasVisa = false;
          this.visaCard = null;
        },
      });
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
    // Validate first
    if (!this.validateCard()) return;

    const [month, year] = this.expirationDate.split('/');
    const payload = {
      cardHolderName: this.cardName.toUpperCase(),
      last4Digits: this.cardNumber.replace(/\s/g, '').slice(-4),
      expiryMonth: parseInt(month),
      expiryYear: 2000 + parseInt(year),
    };

    try {
      // Always delete the old Visa card if it exists
      await this.http
        .delete(`http://localhost:3000/api/user/${this.email}/visa`)
        .toPromise();

      // Then add the new one
      this.http
        .post(`http://localhost:3000/api/user/${this.email}/visa`, payload)
        .subscribe({
          next: () => {
            this.toastr.success(
              'Visa card replaced and subscription confirmed!',
              '✅ Subscribed'
            );
            this.isSubscribed = true;
            this.hasVisa = true;
            this.visaCard = payload;
            this.router.navigate(['/home']);
          },
          error: (err) => {
            console.error('❌ Failed to save Visa:', err);
            this.toastr.error(
              'Failed to save new Visa. Try again.',
              '❌ Error'
            );
          },
        });
    } catch (err) {
      console.error('❌ Failed to delete old Visa:', err);
      this.toastr.error('Could not remove old Visa. Try again.', '❌ Error');
    }
  }

  submitVisa() {
    if (!this.validateCard()) return;

    const [month, year] = this.expirationDate.split('/');
    const payload = {
      cardHolderName: this.cardName.toUpperCase(),
      last4Digits: this.cardNumber.replace(/\s/g, '').slice(-4),
      expiryMonth: parseInt(month),
      expiryYear: 2000 + parseInt(year),
    };

    const url = `http://localhost:3000/api/user/${this.email}/visaSub`;

    this.http.post(url, payload).subscribe({
      next: () => {
        this.toastr.success('Visa card saved and subscription confirmed!');
        this.isSubscribed = true;
        this.router.navigate(['/home']);
      },
      error: () => {
        this.toastr.error('Could not save card. Try again.', '❌ Error');
      },
    });
  }
  confirmUsingVisa() {
    this.toastr.success('✅ Subscribed using saved Visa!');
    this.router.navigate(['/home']);
  }

  deleteVisa() {
    this.http
      .delete(`http://localhost:3000/api/user/${this.email}/visa`)
      .subscribe({
        next: () => {
          this.toastr.success('💳 Visa card removed');
          this.hasVisa = false;
          this.visaCard = null;
          this.showVisaDialog = false;
        },
        error: () => {
          this.toastr.error('❌ Could not remove Visa card');
        },
      });
  }
  validateCard(): boolean {
    const cardNumberPattern = /^\d{4} \d{4} \d{4} \d{4}$/;
    const namePattern = /^[A-Z][A-Z\s]{1,25}$/;
    const expirationPattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
    const securityCodePattern = /^\d{3}$/;

    if (!cardNumberPattern.test(this.cardNumber)) {
      this.toastr.error('Invalid card number...', '❌ Invalid Card');
      return false;
    }

    if (!namePattern.test(this.cardName.toUpperCase())) {
      this.toastr.error('Invalid name...', '❌ Invalid Name');
      return false;
    }

    if (!expirationPattern.test(this.expirationDate)) {
      this.toastr.error('Invalid expiration...', '❌ Invalid Expiry');
      return false;
    }

    if (!securityCodePattern.test(this.securityCode)) {
      this.toastr.error('Invalid CVV...', '❌ Invalid CVV');
      return false;
    }

    return true;
  }
}
