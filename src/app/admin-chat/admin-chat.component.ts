import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService

@Component({
  selector: 'app-admin-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], // No need to import ToastrModule here if configured via provideToastr
  templateUrl: './admin-chat.component.html',
  styleUrls: ['./admin-chat.component.css'],
})
export class AdminChatComponent implements OnInit, AfterViewChecked {
  userEmail: string = '';
  messages: any[] = [];
  newMessage: string = '';

  @ViewChild('scrollBottom') scrollContainer!: ElementRef;

  // Inject ToastrService into the constructor
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private toastr: ToastrService // Inject ToastrService
  ) {}

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
        // Optionally show a toast for loading failure
        this.toastr.error('Could not load chat messages.', 'Chat Error');
      },
    });
  }

  sendMessage() {
    if (!this.newMessage.trim()) {
      this.toastr.warning('Message cannot be empty.', 'Input Required');
      return;
    }

    const msg = { to: this.userEmail, from: 'admin', content: this.newMessage };
    this.http.post('http://localhost:3000/api/chat/send', msg).subscribe({
      next: () => {
        this.messages.push(msg);
        this.newMessage = '';
        this.scrollToBottom();
        this.toastr.success('Message sent successfully!', 'Success'); // Success toast
      },
      error: (err) => {
        console.error('Failed to send message:', err); // Log the actual error
        this.toastr.error('Failed to send message.', 'Error'); // Error toast
      },
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
