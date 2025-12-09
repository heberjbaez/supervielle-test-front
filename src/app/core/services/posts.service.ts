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

  loadPosts(): void {
    this.loadingState.set(true);
    this.errorState.set(null);

    this.api.get<Post[]>('/posts').subscribe({
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

  loadPost(id: number): void {
    this.loadingState.set(true);
    this.errorState.set(null);

    this.api.get<Post>(`/posts/${id}`).subscribe({
      next: (post) => {
        this.postsState.update(posts => {
          const index = posts.findIndex(p => p.id === id);
          if (index !== -1) {
            const updated = [...posts];
            updated[index] = post;
            return updated;
          }
          return [...posts, post];
        });
        this.loadingState.set(false);
      },
      error: (err) => {
        this.errorState.set(err.message);
        this.loadingState.set(false);
      }
    });
  }

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

  createPost(post: Partial<Post>): void {
    this.loadingState.set(true);
    this.errorState.set(null);

    this.api.post<Post>('/posts', post).subscribe({
      next: (newPost) => {
        this.postsState.update(posts => [...posts, newPost]);
        this.loadingState.set(false);
      },
      error: (err) => {
        this.errorState.set(err.message);
        this.loadingState.set(false);
      }
    });
  }

  updatePost(id: number, post: Partial<Post>): void {
    this.loadingState.set(true);
    this.errorState.set(null);

    this.api.put<Post>(`/posts/${id}`, post).subscribe({
      next: (updatedPost) => {
        this.postsState.update(posts =>
          posts.map(p => p.id === id ? updatedPost : p)
        );
        this.loadingState.set(false);
      },
      error: (err) => {
        this.errorState.set(err.message);
        this.loadingState.set(false);
      }
    });
  }

  deletePost(id: number): void {
    this.loadingState.set(true);
    this.errorState.set(null);

    this.api.delete<void>(`/posts/${id}`).subscribe({
      next: () => {
        this.postsState.update(posts => posts.filter(p => p.id !== id));
        this.loadingState.set(false);
      },
      error: (err) => {
        this.errorState.set(err.message);
        this.loadingState.set(false);
      }
    });
  }
}