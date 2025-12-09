import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    const authServiceSpy = {
      login: vi.fn(),
    };
    const routerSpy = {
      navigate: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with an invalid form', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should validate email field as required', () => {
    const emailControl = component.loginForm.controls.email;

    expect(emailControl.valid).toBeFalsy();
    expect(emailControl.hasError('required')).toBeTruthy();
  });

  it('should validate email format', () => {
    const emailControl = component.loginForm.controls.email;

    emailControl.setValue('invalid-email');
    expect(emailControl.hasError('email')).toBeTruthy();

    emailControl.setValue('valid@email.com');
    expect(emailControl.hasError('email')).toBeFalsy();
  });

  it('should validate password field as required', () => {
    const passwordControl = component.loginForm.controls.password;

    expect(passwordControl.valid).toBeFalsy();
    expect(passwordControl.hasError('required')).toBeTruthy();
  });

  it('should validate password minimum length', () => {
    const passwordControl = component.loginForm.controls.password;

    passwordControl.setValue('12345');
    expect(passwordControl.hasError('minlength')).toBeTruthy();

    passwordControl.setValue('123456');
    expect(passwordControl.hasError('minlength')).toBeFalsy();
  });

  it('should mark form as valid when all fields are correct', () => {
    component.loginForm.controls.email.setValue('test@example.com');
    component.loginForm.controls.password.setValue('password123');

    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should call authService.login() when form is valid', () => {
    component.loginForm.controls.email.setValue('test@example.com');
    component.loginForm.controls.password.setValue('password123');

    component.onSubmit();

    expect(authService.login).toHaveBeenCalled();
  });

  it('should not call authService.login() when form is invalid', () => {
    component.loginForm.controls.email.setValue('');
    component.loginForm.controls.password.setValue('');

    component.onSubmit();

    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should mark all fields as touched when submitting invalid form', () => {
    component.onSubmit();

    expect(component.loginForm.controls.email.touched).toBeTruthy();
    expect(component.loginForm.controls.password.touched).toBeTruthy();
  });

  it('should return correct email error message when required', () => {
    const emailControl = component.loginForm.controls.email;
    emailControl.markAsTouched();

    expect(component.getEmailErrorMessage()).toBe('El email es requerido');
  });

  it('should return correct email error message when invalid format', () => {
    const emailControl = component.loginForm.controls.email;
    emailControl.setValue('invalid-email');
    emailControl.markAsTouched();

    expect(component.getEmailErrorMessage()).toBe('Formato de email inválido');
  });

  it('should return correct password error message when required', () => {
    const passwordControl = component.loginForm.controls.password;
    passwordControl.markAsTouched();

    expect(component.getPasswordErrorMessage()).toBe('La contraseña es requerida');
  });

  it('should return correct password error message when too short', () => {
    const passwordControl = component.loginForm.controls.password;
    passwordControl.setValue('12345');
    passwordControl.markAsTouched();

    expect(component.getPasswordErrorMessage()).toBe(
      'La contraseña debe tener al menos 6 caracteres'
    );
  });

  it('should toggle password visibility', () => {
    expect(component.hide).toBeTruthy();

    component.hide = false;
    expect(component.hide).toBeFalsy();

    component.hide = true;
    expect(component.hide).toBeTruthy();
  });
});
