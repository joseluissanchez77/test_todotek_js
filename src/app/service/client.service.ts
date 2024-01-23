import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UrlParameterStandardI } from '../interface/generalParameter.interface';
import { Observable } from 'rxjs';
import { Cliente, ResponseCliente } from '../interface/cliente.interface';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  URL_API = environment.API_URL;

  constructor(private http:HttpClient) { }

  getCustomerPaginate(dataOption? :UrlParameterStandardI ):Observable<ResponseCliente>{

    let page = dataOption?.page;
    let size = dataOption?.size;
    let sort = dataOption?.sort;
    let type_sort = dataOption?.type_sort;

    let direcion =`${this.URL_API}customer?page=${page}&size=${size}&type_sort=${type_sort}&sort=${sort}`;

    return this.http.get<ResponseCliente>(direcion);

  }

  saveCustomer( cliente : Cliente){
    return this.http.post(`${this.URL_API}customer`, cliente);
  }

  deleteCustomer( cliente : Cliente){
    return this.http.delete(`${this.URL_API}customer/${cliente.id}`);
  }

  updateCustomer( cliente : Cliente){
    return this.http.put(`${this.URL_API}customer/${cliente.id}`, cliente);
  }

  getByIdCustomer( cliente : Cliente):Observable<Cliente>{
    return this.http.get<Cliente>(`${this.URL_API}customer/${cliente.id}`);
  }
}
