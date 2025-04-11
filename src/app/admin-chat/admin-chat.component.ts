import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-admin-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-chat.component.html',
  styleUrls: ['./admin-chat.component.css'],
})
export class AdminChatComponent implements OnInit, AfterViewChecked {
  userEmail: string = '';
  messages: any[] = [];
  newMessage: string = '';

  @ViewChild('scrollBottom') scrollContainer!: ElementRef;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.userEmail = decodeURIComponent(this.route.snapshot.paramMap.get('email')!);
    this.loadChat();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  loadChat() {
    this.http.get<any[]>(`http://localhost:3000/api/chat/${this.userEmail}`).subscribe({
      next: (data) => {
        this.messages = data || [];
        this.scrollToBottom();
      },
      error: () => {
        console.warn('[Chat] Could not load messages');
        this.messages = [];
      },
    });
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    const msg = { to: this.userEmail, from: 'admin', content: this.newMessage };
    this.http.post('http://localhost:3000/api/chat/send', msg).subscribe({
      next: () => {
        this.messages.push(msg);
        this.newMessage = '';
        this.scrollToBottom();
      },
      error: () => alert('Failed to send message'),
    });
  }

  scrollToBottom(): void {
    try {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop =
          this.scrollContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Scroll failed:', err);
    }
  }
}
