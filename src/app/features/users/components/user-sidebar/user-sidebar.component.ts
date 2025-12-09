import { Component, input, output, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { User } from '../../../../core/models';
import { PostsService } from '../../../../core/services/posts.service';

@Component({
  selector: 'app-user-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  templateUrl: './user-sidebar.component.html',
  styleUrl: './user-sidebar.component.scss'
})
export class UserSidebarComponent {
  private postsService = inject(PostsService);

  user = input.required<User | null>();
  close = output<void>();

  posts = this.postsService.posts;
  loading = this.postsService.loading;

  userPosts = computed(() => {
    const allPosts = this.posts();
    const currentUser = this.user();

    if (!currentUser) return [];

    return allPosts
      .filter(post => post.userId === currentUser.id)
      .slice(0, 5);
  });

  constructor() {
    effect(() => {
      const currentUser = this.user();
      if (currentUser) {
        this.postsService.loadPostsByUser(currentUser.id);
      }
    });
  }

  onClose(): void {
    this.close.emit();
  }
}