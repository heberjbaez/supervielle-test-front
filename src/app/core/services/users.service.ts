import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from './api.service';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly api = inject(ApiService);

  private usersState = signal<User[]>([]);
  private loadingState = signal(false);
  private errorState = signal<string | null>(null);

  readonly users = this.usersState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  loadUsers(): void {
    this.loadingState.set(true);
    this.errorState.set(null);

    this.api.get<User[]>('/users').subscribe({
      next: (users) => {
        this.usersState.set(users);
        this.loadingState.set(false);
      },
      error: (err) => {
        this.errorState.set(err.message);
        this.loadingState.set(false);
      }
    });
  }
}