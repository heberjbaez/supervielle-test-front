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

  loadUser(id: number): void {
    this.loadingState.set(true);
    this.errorState.set(null);

    this.api.get<User>(`/users/${id}`).subscribe({
      next: (user) => {
        this.usersState.update(users => {
          const index = users.findIndex(u => u.id === id);
          if (index !== -1) {
            const updated = [...users];
            updated[index] = user;
            return updated;
          }
          return [...users, user];
        });
        this.loadingState.set(false);
      },
      error: (err) => {
        this.errorState.set(err.message);
        this.loadingState.set(false);
      }
    });
  }

  createUser(user: Partial<User>): void {
    this.loadingState.set(true);
    this.errorState.set(null);

    this.api.post<User>('/users', user).subscribe({
      next: (newUser) => {
        this.usersState.update(users => [...users, newUser]);
        this.loadingState.set(false);
      },
      error: (err) => {
        this.errorState.set(err.message);
        this.loadingState.set(false);
      }
    });
  }

  updateUser(id: number, user: Partial<User>): void {
    this.loadingState.set(true);
    this.errorState.set(null);

    this.api.put<User>(`/users/${id}`, user).subscribe({
      next: (updatedUser) => {
        this.usersState.update(users =>
          users.map(u => u.id === id ? updatedUser : u)
        );
        this.loadingState.set(false);
      },
      error: (err) => {
        this.errorState.set(err.message);
        this.loadingState.set(false);
      }
    });
  }

  deleteUser(id: number): void {
    this.loadingState.set(true);
    this.errorState.set(null);

    this.api.delete<void>(`/users/${id}`).subscribe({
      next: () => {
        this.usersState.update(users => users.filter(u => u.id !== id));
        this.loadingState.set(false);
      },
      error: (err) => {
        this.errorState.set(err.message);
        this.loadingState.set(false);
      }
    });
  }
}