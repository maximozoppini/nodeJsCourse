import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-singup',
  templateUrl: './singup.component.html',
  styleUrls: ['./singup.component.scss'],
})
export class SingupComponent implements OnInit {
  public signUpForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  signUp(): void {
    this.authService
      .signUp(this.signUpForm.value)
      .pipe(
        catchError((err) => {
          console.log(
            '🚀 ~ file: login.component.ts ~ line 40 ~ LoginComponent ~ catchError ~ err',
            err
          );
          this.snackBar.open(err.error.message);
          return of(null);
        })
      )
      .subscribe((data) => {
        if (data) {
          this.router.navigateByUrl('/home');
        }
      });
  }
}
