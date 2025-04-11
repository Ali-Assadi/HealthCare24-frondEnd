import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './user-chat.component.html',
  styleUrls: ['./user-chat.component.css']
})
export class UserChatComponent implements OnInit, AfterViewChecked {
  userEmail: string = '';
  messages: any[] = [];
  newMessage: string = '';

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      alert('You must be signed in');
      return;
    }

    this.userEmail = email;
    this.loadChat();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  loadChat(): void {
    this.http.get<any[]>(`http://localhost:3000/api/chat/${this.userEmail}`).subscribe({
      next: (data) => {
        this.messages = data;
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: () => alert('Failed to load messages')
    });
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;

    const msg = { from: this.userEmail, to: 'admin', content: this.newMessage };

    this.http.post('http://localhost:3000/api/chat/send', msg).subscribe({
      next: () => {
        this.messages.push(msg);
        this.newMessage = '';
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: () => alert('Failed to send message')
    });
  }

  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop =
        this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.warn('Auto-scroll failed:', err);
    }
  }
}
