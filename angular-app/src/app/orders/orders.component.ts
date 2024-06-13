import { Component, OnInit } from '@angular/core';
import { Order, OrderItem } from '../models/order.model';
import { Product } from '../models/product.model';
import { OrderService } from '../services/order.service';
import { ProductService } from '../services/product.service';

import { Router } from '@angular/router'; // Importar Router


@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  newOrder: Order = {id:0, userId: 0, deliveryAddress: '', status: 'PENDING', paymentMethod: 'CREDIT_CARD', date: new Date(), orderDetails: [] };
  products: Product[] = [];
  selectedProduct: Product | null = null;
  quantity: number = 1;

  constructor(private orderService: OrderService, private productService: ProductService, private router: Router) { } // Inyectar Router en el constructor


  ngOnInit(): void {
    this.loadOrders();
    this.loadProducts();
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe(orders => {
      this.orders = orders;
      // Cargar detalles completos del producto para cada OrderItem
      this.loadOrderDetails();
    });
  }
  /*mily*/

  loadOrderDetails(): void {
    for (const order of this.orders) {
      for (const orderItem of order.orderDetails) {
        this.productService.getProductById(orderItem.productId).subscribe(product => {
          orderItem.product = product;
        });
      }
    }
  }
/*en mily*/
  loadProducts(): void {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
    });
  }

  addOrder(): void {
    if (this.selectedProduct && this.selectedProduct.id !== undefined) {
      const orderItem: OrderItem = {
        productId: this.selectedProduct.id,
        quantity: this.quantity,
        price: this.selectedProduct.price
      };

      this.newOrder.orderDetails.push(orderItem);

      this.orderService.createOrder(this.newOrder).subscribe((createdOrder: Order) => {
        this.loadOrders();
        this.newOrder = { id:0, userId: 0, deliveryAddress: '', status: 'PENDING', paymentMethod: 'CREDIT_CARD', date: new Date(), orderDetails: [] };
        this.selectedProduct = null;
        this.quantity = 1;
      });
    } else {
      console.error('Selected product is invalid or undefined');
    }
  }

  onSelectProduct(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedIndex = parseInt(selectElement.value, 10);
    if (!isNaN(selectedIndex) && this.products[selectedIndex]) {
      this.selectedProduct = this.products[selectedIndex];
    } else {
      this.selectedProduct = null;
    }
  }

  getProductById(productId: number): Product | undefined {
    return this.products.find(product => product.id === productId);
  }

  editOrder(orderId: number) {
    this.router.navigate(['/create-order', orderId]);
  }
}
