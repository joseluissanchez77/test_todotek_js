import { Component, Input, OnInit } from '@angular/core';
import { Cliente, ResponseCliente } from '../interface/cliente.interface';
import { UrlParameterStandardI } from '../interface/generalParameter.interface';
import { ClientService } from '../service/client.service';
import Swal from 'sweetalert2';
import { AbstractControl, FormBuilder, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrl: './client.component.css'
})
export class ClientComponent implements OnInit {

  clientForm: Cliente = {
    id: 0,
    primer_nombre: '',
    segundo_nombre: '',
    apellidos: '',
    identificacion: '',
    correo: ''

  };
  displayStyle = "none";
  ActionBtn: string = 'Guardar';
  longitudMaximaNombre: number = 25;
  longitudMaximaCedula: number = 10;
  longitudMaximaApellido: number = 40;
  longitudMaximaTelefono: number = 10;


  @Input() objGetClient: Cliente[] | any = [];
  page: number = 1;
  pageSize: number = 5;
  collectionSize: number = 0;

  constructor(
    private clienteService: ClientService,
    private fb: FormBuilder
  ) {
    this.cientes();
  }

  clientViewForm = this.fb.group({
    fcn_id: [''],
    fcn_identification: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)], [this.validarLongitudMaximaAsync.bind(this, this.longitudMaximaCedula)]],
    fcn_nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)], [this.validarLongitudMaximaAsync.bind(this, this.longitudMaximaNombre)]],
    fcn_segundo_nombre: [''],
    fcn_apellido: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)], [this.validarLongitudMaximaAsync.bind(this, this.longitudMaximaApellido)]],
    fcn_correo: ['', Validators.required]
  });


  ngOnInit(): void {
  }


  cientes() {
    // this.loading = true;
    let parameterUrl: UrlParameterStandardI = {
      page: this.page,
      size: this.pageSize, // this.rows,
      sort: 'id',
      type_sort: 'desc',
    };

    this.clienteService.getCustomerPaginate(parameterUrl).subscribe({
      next: (rpt: ResponseCliente) => {
        // console.log(rpt);
        this.objGetClient = rpt.data;
        this.collectionSize = rpt.total;
      },
      error: (e) => {
        console.log(e);
        // this.loading = false;
      },
    });
  }

  closePopup() {
    this.displayStyle = "none";
  }

  dataClientRow(data: Cliente) {
    // console.log(data);
  }

  btnAddClients() {
    this.ActionBtn = 'Guardar';
    this.clientViewForm.reset();
    this.clientViewForm.get('fcn_id')?.setValue('0');
    this.displayStyle = "block";
  }


  loadPage(page: number) {
    this.cientes();
  }

  deleteClientRowConfirm(data: Cliente) {
    Swal.fire({
      title: 'Esta seguro de borrar cliente?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Borrar',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteClient(data);
      } else if (result.isDenied) {
        Swal.fire('Accion cancelada', '', 'info');
      }
    });
  }

  deleteClient(data: Cliente) {
    this.clienteService.deleteCustomer(data).subscribe({
      next: (rpt) => {
        this.cientes();
        // console.log(rpt);
      },
      error: (errorData) => {
        console.log(errorData);
        // this.loginError = errorData?.error?.detail;
      },
      complete: () => {
        // this.formGroupProductos.reset();
        // this.formGroupProductos.get('fcn_categoria')?.setValue('');
        Swal.fire('Cliente Borrado!', '', 'success');
      },
    });
  }


  btnUpdateClient($event: Cliente) {
    this.ActionBtn = 'Actualizar'
    this.displayStyle = "block";


    this.clienteService.getByIdCustomer($event).subscribe({
      next: (rpt: Cliente) => {
        this.clientForm = rpt;
      },
      error: (errorData) => {
        console.log(errorData);
      }
    });

  }

  accionEditarGuardar() {

    if (this.clientViewForm.valid) {

      let data = {
        id: this.clientViewForm.get('fcn_id')?.value,
        identificacion: this.clientViewForm.get('fcn_identification')?.value,
        primer_nombre: this.clientViewForm.get('fcn_nombre')?.value,
        segundo_nombre: this.clientViewForm.get('fcn_segundo_nombre')?.value,
        apellidos: this.clientViewForm.get('fcn_apellido')?.value,
        correo: this.clientViewForm.get('fcn_correo')?.value
      };


      if (this.clientForm.id == 0) {
        this.saveClient(data);
      } else {
        this.editClient(data);
      }
     

    } else {
      this.clientViewForm.markAllAsTouched();
    }

  }


  editClient(data: any) {
    this.clienteService.updateCustomer(data as Cliente).subscribe({
      next: (rpt) => {
        this.clearForm();
        this.closePopup();
        this.cientes();
      },
      error: (errorData) => {
        console.log(errorData);
        Swal.fire('Error!', '', 'error');
      },
      complete: () => {

        Swal.fire('Actualizado!', '', 'success');
      },
    });
  }

  saveClient(data: any) {
    this.clienteService.saveCustomer(data as Cliente).subscribe({
      next: (rpt:any) => {
        this.clearForm();
        this.closePopup();
        this.cientes();
      },
      error: (errorData:any) => {
        console.log(errorData);
        Swal.fire('Error!', '', 'error');
      },
      complete: () => {

        Swal.fire('Guardado!', '', 'success');
      },
    });
  }

  clearForm() {
    this.clientViewForm.reset();
    this.clientViewForm.get('fcn_id')?.setValue('0');
  }


  /**
  * get
  */
  get fcn_identification() {
    return this.clientViewForm.controls.fcn_identification;
  }
  get fcn_nombre() {
    return this.clientViewForm.controls.fcn_nombre;
  }
  get fcn_segundo_nombre() {
    return this.clientViewForm.controls.fcn_segundo_nombre;
  }
  get fcn_apellido() {
    return this.clientViewForm.controls.fcn_apellido;
  }
  get fcn_correo() {
    return this.clientViewForm.controls.fcn_correo;
  }


  async validarLongitudMaximaAsync(longitudMaxima: number,
    control: AbstractControl): Promise<ValidationErrors | null> {
    const valor = control.value;

    if (!valor) {
      return Promise.resolve(null); // Valor vacío, no aplicar la validación
    }

    const esValido = valor.length <= longitudMaxima;

    return esValido ? null : { longitudInvalida: true };
  }

  async validarNumeroInicio(control: AbstractControl): Promise<ValidationErrors | null> {
    const valor = control.value;

    if (!valor) {
      return Promise.resolve(null); // Valor vacío, no aplicar la validación
    }

    const primerosDosDigitos = valor.substring(0, 2);
    if (primerosDosDigitos !== '09') {
      return { numeroInvalido: true };
    }

    return null;
  }



}
