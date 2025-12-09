import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { UsersService } from '../../core/services/users.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
  private authService = inject(AuthService);
  private usersService = inject(UsersService);

  users = this.usersService.users;
  loading = this.usersService.loading;
  error = this.usersService.error;

  private currentPageSignal = signal(1);
  private readonly itemsPerPage = 5;

  currentPage = this.currentPageSignal.asReadonly();

  paginatedUsers = computed(() => {
    const allUsers = this.users();
    const start = (this.currentPageSignal() - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return allUsers.slice(start, end);
  });

  totalPages = computed(() => {
    return Math.ceil(this.users().length / this.itemsPerPage);
  });

  ngOnInit(): void {
    this.usersService.loadUsers();
  }

  nextPage(): void {
    if (this.currentPageSignal() < this.totalPages()) {
      this.currentPageSignal.update(page => page + 1);
    }
  }

  previousPage(): void {
    if (this.currentPageSignal() > 1) {
      this.currentPageSignal.update(page => page - 1);
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPageSignal.set(page);
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
