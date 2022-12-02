import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, of, Subject } from 'rxjs';
import { AuthService } from '../auth.service';
import { MensajesService } from '../mensajes.service';
import { ProcessService } from '../process.service';
import { ProductoService } from '../producto.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public productoForm!: FormGroup;
  public mensajeForm!: FormGroup;
  public destroy$ = new Subject<boolean>();
  public productos: any = [{}];
  public mensajes: any = [{}];
  public displayedColumns: string[] = ['title', 'price', 'thumbnail'];
  public username!: string;
  public infoProcess!: string;

  @ViewChild('form') form!: NgForm;
  @ViewChild('formMensaje') formMensaje!: NgForm;

  constructor(
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private serviceProducto: ProductoService,
    private serviceMensajes: MensajesService,
    private authService: AuthService,
    private processService: ProcessService,
    private router: Router
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit(): void {
    this.authService
      .isLogged()
      .pipe(catchError((err) => this.router.navigateByUrl('/login')))
      .subscribe((data) => {
        console.log('data', data);
        this.username = data?.username;
      });

    this.processService.getInfo().subscribe((data) => {
      console.log(data);
      this.infoProcess = `carpeta: ${data[0].carpeta}, memoria: ${data[0].memoria}, path: ${data[0].path}, pid: ${data[0].pid}, SO: ${data[0].sistemaOperativo}, version: ${data[0].version}`;
    });

    this.productoForm = this.formBuilder.group({
      title: ['', Validators.required],
      price: ['', Validators.required],
      thumbnail: ['', Validators.required],
    });

    this.mensajeForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      mensaje: '',
      nombre: '',
      apellido: '',
      avatar: '',
      edad: '',
      alias: '',
    });

    // this.serviceProducto.get().subscribe((data) => (this.productos = data));
    // this.serviceMensajes.get().subscribe((data) => (this.mensajes = data));
  }

  enviarForm(): void {
    let casa = this.productoForm.value;

    this.serviceProducto.save(casa);
    this.productoForm.reset();
    this.form.resetForm();
    this.snackBar.open('Se pudo registrar exitosamente el producto');
  }

  enviarMensaje(): void {
    let mensaje = this.mensajeForm.value;
    this.serviceMensajes.sendMensaje(mensaje);
  }

  getProductTests(): void {
    this.serviceProducto.getTestProducts().subscribe((data) => {
      console.log(data);
      this.productos = data;
    });
  }

  logOut(): void {
    this.authService
      .logout()
      .pipe(
        catchError((err) => {
          this.snackBar.open(err.error.message);
          return of(null);
        })
      )
      .subscribe((data) => this.router.navigateByUrl('/login'));
  }
}
