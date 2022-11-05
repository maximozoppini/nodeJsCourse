import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, take } from 'rxjs';
import { MensajesService } from './mensajes.service';
import { ProductoService } from './producto.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  public productoForm!: FormGroup;
  public mensajeForm!: FormGroup;
  public destroy$ = new Subject<boolean>();
  public productos = [];
  public mensajes: any = [{}];
  public displayedColumns: string[] = ['title', 'price', 'thumbnail'];

  @ViewChild('form') form!: NgForm;
  @ViewChild('formMensaje') formMensaje!: NgForm;

  constructor(
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private serviceProducto: ProductoService,
    private serviceMensajes: MensajesService
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit(): void {
    this.productoForm = this.formBuilder.group({
      title: ['', Validators.required],
      price: ['', Validators.required],
      thumbnail: ['', Validators.required],
    });

    this.mensajeForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      mensaje: '',
    });

    this.serviceProducto.get().subscribe((data) => (this.productos = data));
    this.serviceMensajes.get().subscribe((data) => (this.mensajes = data));
  }

  formValid(): boolean {
    return !this.productoForm.valid;
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
}
