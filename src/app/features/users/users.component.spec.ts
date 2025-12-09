import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { UsersComponent } from './users.component';
import { AuthService } from '../../core/services/auth.service';
import { UsersService } from '../../core/services/users.service';
import { User } from '../../core/models';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let authService: AuthService;
  let usersService: UsersService;

  const mockUsers: User[] = [
    {
      id: 1,
      name: 'Alice Williams',
      username: 'alicew',
      email: 'alice@example.com',
      address: {
        city: 'New York',
        zipcode: '10001',
      },
      phone: '123-456-7890',
      website: 'alice.com',
      company: {
        name: 'Tech Corp',
      },
    },
    {
      id: 2,
      name: 'Jane Smith',
      username: 'janesmith',
      email: 'jane@example.com',
      address: {
        city: 'Los Angeles',
        zipcode: '90001',
      },
      phone: '098-765-4321',
      website: 'janesmith.com',
      company: {
        name: 'Design Co',
      },
    },
    {
      id: 3,
      name: 'Bob Martinez',
      username: 'bobm',
      email: 'bob@example.com',
      address: {
        city: 'Chicago',
        zipcode: '60601',
      },
      phone: '111-222-3333',
      website: 'bob.com',
      company: {
        name: 'Tech Corp',
      },
    },
    {
      id: 4,
      name: 'Carol Davis',
      username: 'carold',
      email: 'carol@example.com',
      address: {
        city: 'Houston',
        zipcode: '77001',
      },
      phone: '444-555-6666',
      website: 'carol.com',
      company: {
        name: 'Design Co',
      },
    },
    {
      id: 5,
      name: 'David Brown',
      username: 'davidb',
      email: 'david@example.com',
      address: {
        city: 'Phoenix',
        zipcode: '85001',
      },
      phone: '777-888-9999',
      website: 'david.com',
      company: {
        name: 'Tech Corp',
      },
    },
    {
      id: 6,
      name: 'Emma Wilson',
      username: 'emmaw',
      email: 'emma@example.com',
      address: {
        city: 'Philadelphia',
        zipcode: '19019',
      },
      phone: '222-333-4444',
      website: 'emma.com',
      company: {
        name: 'Design Co',
      },
    },
  ];

  beforeEach(async () => {
    const authServiceSpy = {
      logout: vi.fn(),
    };
    const usersServiceSpy = {
      loadUsers: vi.fn(),
      users: signal<User[]>(mockUsers),
      loading: signal(false),
      error: signal<string | null>(null),
    };

    await TestBed.configureTestingModule({
      imports: [UsersComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: UsersService, useValue: usersServiceSpy },
      ],
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    usersService = TestBed.inject(UsersService);
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    expect(usersService.loadUsers).toHaveBeenCalled();
  });

  it('should display users from service', () => {
    expect(component.users()).toEqual(mockUsers);
  });

  it('should filter users by search text', () => {
    component.onSearchChange('alice');
    expect(component.filteredUsers().length).toBe(1);
    expect(component.filteredUsers()[0].name).toBe('Alice Williams');
  });

  it('should filter users by email', () => {
    component.onSearchChange('jane@example.com');
    expect(component.filteredUsers().length).toBe(1);
    expect(component.filteredUsers()[0].email).toBe('jane@example.com');
  });

  it('should filter users by company', () => {
    component.onCompanyChange('Tech Corp');
    expect(component.filteredUsers().length).toBe(3);
  });

  it('should combine search and company filters', () => {
    component.onSearchChange('alice');
    component.onCompanyChange('Tech Corp');
    expect(component.filteredUsers().length).toBe(1);
    expect(component.filteredUsers()[0].name).toBe('Alice Williams');
  });

  it('should clear all filters', () => {
    component.onSearchChange('alice');
    component.onCompanyChange('Tech Corp');
    component.clearFilters();

    expect(component.searchText()).toBe('');
    expect(component.selectedCompany()).toBe('');
    expect(component.filteredUsers().length).toBe(6);
  });

  it('should reset page to 1 when searching', () => {
    component.nextPage();
    expect(component.currentPage()).toBe(2);

    component.onSearchChange('alice');
    expect(component.currentPage()).toBe(1);
  });

  it('should reset page to 1 when changing company filter', () => {
    component.nextPage();
    expect(component.currentPage()).toBe(2);

    component.onCompanyChange('Tech Corp');
    expect(component.currentPage()).toBe(1);
  });

  it('should paginate users correctly', () => {
    const paginatedUsers = component.paginatedUsers();
    expect(paginatedUsers.length).toBeLessThanOrEqual(5);
  });

  it('should calculate total pages correctly', () => {
    const totalPages = component.totalPages();
    expect(totalPages).toBe(Math.ceil(mockUsers.length / 5));
  });

  it('should navigate to next page', () => {
    const initialPage = component.currentPage();
    component.nextPage();
    expect(component.currentPage()).toBe(initialPage + 1);
  });

  it('should navigate to previous page', () => {
    component.nextPage();
    const currentPage = component.currentPage();
    component.previousPage();
    expect(component.currentPage()).toBe(currentPage - 1);
  });

  it('should not go below page 1', () => {
    component.previousPage();
    expect(component.currentPage()).toBe(1);
  });

  it('should not exceed total pages', () => {
    const totalPages = component.totalPages();
    for (let i = 0; i < 10; i++) {
      component.nextPage();
    }
    expect(component.currentPage()).toBeLessThanOrEqual(totalPages);
  });

  it('should go to specific page', () => {
    component.goToPage(2);
    expect(component.currentPage()).toBe(2);
  });

  it('should not go to invalid page number', () => {
    component.goToPage(-1);
    expect(component.currentPage()).toBe(1);

    component.goToPage(999);
    expect(component.currentPage()).toBe(1);
  });

  it('should extract unique companies', () => {
    const companies = component.companies();
    expect(companies.length).toBe(2);
    expect(companies).toContain('Tech Corp');
    expect(companies).toContain('Design Co');
  });

  it('should open user sidebar', () => {
    const user = mockUsers[0];
    component.openUserSidebar(user);
    expect(component.selectedUser()).toBe(user);
  });

  it('should close sidebar', () => {
    const user = mockUsers[0];
    component.openUserSidebar(user);
    expect(component.selectedUser()).toBe(user);

    component.closeSidebar();
    expect(component.selectedUser()).toBeNull();
  });

  it('should call logout on AuthService', () => {
    component.logout();
    expect(authService.logout).toHaveBeenCalled();
  });

  it('should handle case-insensitive search', () => {
    component.onSearchChange('ALICE');
    expect(component.filteredUsers().length).toBe(1);
    expect(component.filteredUsers()[0].name).toBe('Alice Williams');
  });

  it('should trim search text', () => {
    component.onSearchChange('  alice  ');
    expect(component.filteredUsers().length).toBe(1);
  });

  it('should show all users when search is empty', () => {
    component.onSearchChange('alice');
    component.onSearchChange('');
    expect(component.filteredUsers().length).toBe(6);
  });

  it('should show all users when company filter is empty', () => {
    component.onCompanyChange('Tech Corp');
    component.onCompanyChange('');
    expect(component.filteredUsers().length).toBe(6);
  });
});
