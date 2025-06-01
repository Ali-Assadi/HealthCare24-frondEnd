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
import { ToastrService } from 'ngx-toastr'; // Import ToastrService

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

  constructor(private http: HttpClient, private toastr: ToastrService) {} // Inject ToastrService

  ngOnInit(): void {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      this.toastr.warning('You must be signed in to access chat.', 'Login Required'); // Replaced alert
      // Optionally redirect to login page here if not signed in
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
        this.toastr.success('Chat messages loaded.', 'Chat Loaded'); // Success toast
      },
      error: (err) => {
        console.error('Failed to load messages:', err);
        this.toastr.error('Failed to load messages.', 'Chat Error'); // Replaced alert
      }
    });
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) {
      this.toastr.warning('Message cannot be empty.', 'Input Required'); // Warning toast
      return;
    }

    const msg = { from: this.userEmail, to: 'admin', content: this.newMessage };

    this.http.post('http://localhost:3000/api/chat/send', msg).subscribe({
      next: () => {
        this.messages.push(msg);
        this.newMessage = '';
        setTimeout(() => this.scrollToBottom(), 100);
        this.toastr.success('Message sent successfully!', 'Message Sent'); // Success toast
      },
      error: (err) => {
        console.error('Failed to send message:', err);
        this.toastr.error('Failed to send message.', 'Error'); // Replaced alert
      }
    });
  }

  scrollToBottom(): void {
    try {
      if (this.scrollContainer) { // Added check for scrollContainer to prevent error if not yet available
        this.scrollContainer.nativeElement.scrollTop =
          this.scrollContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.warn('Auto-scroll failed:', err);
    }
  }
}
