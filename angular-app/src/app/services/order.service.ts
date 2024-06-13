import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  //private apiUrl = 'http://java-service:8082/orders'; // URL del endpoint del servidor para manejar las órdenes Java
  private apiUrl = 'http://localhost:8082/orders'; // URL del endpoint del servidor para manejar las órdenes Java

  constructor(private http: HttpClient) { }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}`);
  }

  /*createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/create`, order);
  }*/

  /*createOrder(order: any): Observable<any> {
    return this.http.post<Order>(`${this.apiUrl}/create`, order);
  }*/

  getOrderById(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${orderId}`);
  }
    
  createOrder(orderData: any): Observable<Order> {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };
  
      return this.http.post<Order>(`${this.apiUrl}/create`, orderData, httpOptions);
  }

  updateOrder(orderId: number, orderData: any): Observable<Order> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.put<Order>(`${this.apiUrl}/${orderId}`, orderData, httpOptions);
  }


  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}