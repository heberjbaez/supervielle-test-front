import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { UserSidebarComponent } from './user-sidebar.component';
import { PostsService } from '../../../../core/services/posts.service';
import { User, Post } from '../../../../core/models';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('UserSidebarComponent', () => {
  let component: UserSidebarComponent;
  let fixture: ComponentFixture<UserSidebarComponent>;
  let postsService: PostsService;

  const mockUser: User = {
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
  };

  const mockPosts: Post[] = [
    {
      userId: 1,
      id: 1,
      title: 'First Post',
      body: 'This is the first post',
    },
    {
      userId: 1,
      id: 2,
      title: 'Second Post',
      body: 'This is the second post',
    },
    {
      userId: 1,
      id: 3,
      title: 'Third Post',
      body: 'This is the third post',
    },
    {
      userId: 1,
      id: 4,
      title: 'Fourth Post',
      body: 'This is the fourth post',
    },
    {
      userId: 1,
      id: 5,
      title: 'Fifth Post',
      body: 'This is the fifth post',
    },
    {
      userId: 1,
      id: 6,
      title: 'Sixth Post',
      body: 'This is the sixth post',
    },
    {
      userId: 2,
      id: 7,
      title: 'Other User Post',
      body: 'This is another user post',
    },
  ];

  beforeEach(async () => {
    const postsServiceSpy = {
      loadPostsByUser: vi.fn(),
      posts: signal<Post[]>(mockPosts),
      loading: signal(false),
      error: signal<string | null>(null),
    };

    await TestBed.configureTestingModule({
      imports: [UserSidebarComponent],
      providers: [{ provide: PostsService, useValue: postsServiceSpy }],
    }).compileComponents();

    postsService = TestBed.inject(PostsService);
    fixture = TestBed.createComponent(UserSidebarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('user', mockUser);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load posts when user is provided', () => {
    fixture.componentRef.setInput('user', mockUser);
    fixture.detectChanges();

    expect(postsService.loadPostsByUser).toHaveBeenCalledWith(mockUser.id);
  });

  it('should not load posts when user is null', () => {
    fixture.componentRef.setInput('user', null);
    fixture.detectChanges();

    expect(postsService.loadPostsByUser).not.toHaveBeenCalled();
  });

  it('should filter posts by user id', () => {
    fixture.componentRef.setInput('user', mockUser);
    fixture.detectChanges();

    const userPosts = component.userPosts();
    expect(userPosts.length).toBe(5);
    expect(userPosts.every((post) => post.userId === mockUser.id)).toBeTruthy();
  });

  it('should limit posts to 5', () => {
    fixture.componentRef.setInput('user', mockUser);
    fixture.detectChanges();

    const userPosts = component.userPosts();
    expect(userPosts.length).toBe(5);
  });

  it('should return empty array when user is null', () => {
    fixture.componentRef.setInput('user', null);
    fixture.detectChanges();

    const userPosts = component.userPosts();
    expect(userPosts.length).toBe(0);
  });

  it('should emit close event when onClose is called', () => {
    fixture.componentRef.setInput('user', mockUser);
    fixture.detectChanges();

    const closeSpy = vi.fn();
    component.close.subscribe(closeSpy);

    component.onClose();

    expect(closeSpy).toHaveBeenCalled();
  });

  it('should display user information', () => {
    fixture.componentRef.setInput('user', mockUser);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain(mockUser.name);
    expect(compiled.textContent).toContain(mockUser.username);
    expect(compiled.textContent).toContain(mockUser.email);
    expect(compiled.textContent).toContain(mockUser.phone);
    expect(compiled.textContent).toContain(mockUser.address.city);
    expect(compiled.textContent).toContain(mockUser.address.zipcode);
    expect(compiled.textContent).toContain(mockUser.company.name);
    expect(compiled.textContent).toContain(mockUser.website);
  });

  it('should display loading spinner when loading', () => {
    const loadingSignal = signal(true);
    const postsServiceWithLoading = {
      loadPostsByUser: vi.fn(),
      posts: signal<Post[]>([]),
      loading: loadingSignal,
      error: signal<string | null>(null),
    };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [UserSidebarComponent],
      providers: [{ provide: PostsService, useValue: postsServiceWithLoading }],
    }).compileComponents();

    fixture = TestBed.createComponent(UserSidebarComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('user', mockUser);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const spinner = compiled.querySelector('mat-spinner');
    expect(spinner).toBeTruthy();
  });

  it('should display posts when available', () => {
    fixture.componentRef.setInput('user', mockUser);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const postCards = compiled.querySelectorAll('.post-card');
    expect(postCards.length).toBe(5);
  });

  it('should reload posts when user changes', () => {
    fixture.componentRef.setInput('user', mockUser);
    fixture.detectChanges();

    expect(postsService.loadPostsByUser).toHaveBeenCalledWith(mockUser.id);
    expect(postsService.loadPostsByUser).toHaveBeenCalledTimes(1);

    const newUser: User = {
      ...mockUser,
      id: 2,
      name: 'Jane Smith',
    };

    fixture.componentRef.setInput('user', newUser);
    fixture.detectChanges();

    expect(postsService.loadPostsByUser).toHaveBeenCalledWith(newUser.id);
    expect(postsService.loadPostsByUser).toHaveBeenCalledTimes(2);
  });

  it('should display no posts message when no posts available', () => {
    const postsServiceEmpty = {
      loadPostsByUser: vi.fn(),
      posts: signal<Post[]>([]),
      loading: signal(false),
      error: signal<string | null>(null),
    };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [UserSidebarComponent],
      providers: [{ provide: PostsService, useValue: postsServiceEmpty }],
    }).compileComponents();

    fixture = TestBed.createComponent(UserSidebarComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('user', mockUser);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('No hay publicaciones disponibles');
  });
});