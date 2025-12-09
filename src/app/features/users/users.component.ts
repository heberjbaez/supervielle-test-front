import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { UsersService } from '../../core/services/users.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  searchText = signal('');
  selectedCompany = signal('');

  currentPage = this.currentPageSignal.asReadonly();

  companies = computed(() => {
    const allUsers = this.users();
    const uniqueCompanies = new Set(allUsers.map(u => u.company.name));
    return Array.from(uniqueCompanies).sort();
  });

  filteredUsers = computed(() => {
    const allUsers = this.users();
    const search = this.searchText().toLowerCase().trim();
    const company = this.selectedCompany();

    return allUsers.filter(user => {
      const matchesSearch = !search ||
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search);

      const matchesCompany = !company || user.company.name === company;

      return matchesSearch && matchesCompany;
    });
  });

  paginatedUsers = computed(() => {
    const filtered = this.filteredUsers();
    const start = (this.currentPageSignal() - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return filtered.slice(start, end);
  });

  totalPages = computed(() => {
    return Math.ceil(this.filteredUsers().length / this.itemsPerPage);
  });

  ngOnInit(): void {
    this.usersService.loadUsers();
  }

  onSearchChange(value: string): void {
    this.searchText.set(value);
    this.currentPageSignal.set(1);
  }

  onCompanyChange(value: string): void {
    this.selectedCompany.set(value);
    this.currentPageSignal.set(1);
  }

  clearFilters(): void {
    this.searchText.set('');
    this.selectedCompany.set('');
    this.currentPageSignal.set(1);
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
