import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AuthService } from '../../core/services/auth.service';
import { UsersService } from '../../core/services/users.service';
import { User } from '../../core/models';
import { UserSidebarComponent } from './components/user-sidebar/user-sidebar.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatPaginatorModule,
    MatSidenavModule,
    UserSidebarComponent
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['username', 'name', 'email', 'company'];
  private authService = inject(AuthService);
  private usersService = inject(UsersService);

  users = this.usersService.users;
  loading = this.usersService.loading;
  error = this.usersService.error;

  private currentPageSignal = signal(1);
  private readonly itemsPerPage = 5;

  searchText = signal('');
  selectedCompany = signal('');
  selectedUser = signal<User | null>(null);

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

  openUserSidebar(user: User): void {
    this.selectedUser.set(user);
  }

  closeSidebar(): void {
    this.selectedUser.set(null);
  }

  logout(): void {
    this.authService.logout();
  }
}
