import { ChangeDetectorRef, Component } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [HttpClientModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})

export class Register {
  userName = '';
  password = '';
  emailAddress = '';
  errorMessage = '';
  successMessage = '';
  confirmPassword!: string;

  constructor(private auth: Auth, private router: Router, private cdr: ChangeDetectorRef) {}

  register(form: NgForm) {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      this.cdr.detectChanges();
      return;
    }
    if (form.invalid) return;

    this.auth.register({ userName: this.userName, password: this.password, emailAddress: this.emailAddress })
     .subscribe({
      next: res => {
        this.successMessage = 'Registeration successful! You can now login. ';
        this.router.navigate(['/login']);
      },
      error: err => {
        this.errorMessage = err.error?.message || 'Registeration failed.';
        this.cdr.detectChanges();
      }
     });
  }
}