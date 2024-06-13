
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  //private apiUrl = 'http://php-service:8000/api/products'; // URL del microservicio en PHP

  private apiUrl = 'http://localhost:8000/api/products'; // URL del microservicio en PHP

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {    
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProductById(productId: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${productId}`);
  }

 /* createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }*/

  createProduct(formData: FormData): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, formData);
  }

  /*updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${product.id}`, product);
  }*/

  updateProduct(productId: number, formData: FormData): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/update/${productId}`, formData);
  }

  deleteImage(productId: number, imageId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${productId}/images/${imageId}`);
  }

  deleteProduct(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${productId}`);
  }

}
