import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from './api.service';
import { Post } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private readonly api = inject(ApiService);

  private postsState = signal<Post[]>([]);
  private loadingState = signal(false);
  private errorState = signal<string | null>(null);

  readonly posts = this.postsState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  loadPostsByUser(userId: number): void {
    this.loadingState.set(true);
    this.errorState.set(null);

    this.api.get<Post[]>(`/posts?userId=${userId}`).subscribe({
      next: (posts) => {
        this.postsState.set(posts);
        this.loadingState.set(false);
      },
      error: (err) => {
        this.errorState.set(err.message);
        this.loadingState.set(false);
      }
    });
  }
}