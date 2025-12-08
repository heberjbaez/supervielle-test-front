import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-users',
  standalone: true,
  templateUrl: './users.component.html',
})
export class UsersComponent {
  private authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}
