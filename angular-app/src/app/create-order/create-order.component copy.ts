import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../services/order.service';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { Order, OrderItem } from '../models/order.model';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent implements OnInit {
  orderForm: FormGroup;
  products: Product[] = [];
  isEditMode: boolean = false;
  orderId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private productService: ProductService
  ) {
    this.orderForm = this.fb.group({
      date: ['', Validators.required],
      status: ['', Validators.required],
      delivery_address: ['', Validators.required],
      payment_method: ['', Validators.required],
      user_id: ['', Validators.required],
      orderDetails: this.fb.array([])
    });
  }

  ngOnInit() {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
    });

    this.route.paramMap.subscribe(params => {
      this.orderId = Number(params.get('id'));
      this.isEditMode = !!this.orderId;

      if (this.isEditMode && this.orderId) {
        this.loadOrder(this.orderId);
      }
    });
  }

  get orderDetails() {
    return this.orderForm.get('orderDetails') as FormArray;
  }

  addProduct() {
    const orderDetailGroup = this.fb.group({
      product_id: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]]
    });
    this.orderDetails.push(orderDetailGroup);
  }

  removeProduct(index: number) {
    this.orderDetails.removeAt(index);
  }

  getProduct(productId: number): Product | undefined {
    const product = this.products.find(product => product.id === productId);
    console.log(`Product ID: ${productId}, Product:`, product); // Debugging line
    return product;
  }

  getProductName(productId: number): string {
    const product = this.getProduct(productId);
    return product ? product.name : 'Producto no encontrado';
  }

  getProductPrice(productId: number): number {
    const product = this.getProduct(productId);
    return product ? product.price : 0;
  }

  loadOrder(orderId: number) {
    this.orderService.getOrderById(orderId).subscribe(order => {
      this.orderForm.patchValue({
        date: order.date,
        status: order.status,
        delivery_address: order.deliveryAddress,
        payment_method: order.paymentMethod,
        user_id: order.userId,
      });

      order.orderDetails.forEach(detail => {
        this.orderDetails.push(this.fb.group({
          product_id: [detail.productId, Validators.required],
          quantity: [detail.quantity, [Validators.required, Validators.min(1)]]
        }));
      });
    });
  }

  onSubmit() {
    if (this.orderForm.valid) {
      const orderData = {
        order: {
          date: this.orderForm.value.date,
          status: this.orderForm.value.status,
          deliveryAddress: this.orderForm.value.delivery_address,
          paymentMethod: this.orderForm.value.payment_method,
          userId: this.orderForm.value.user_id
        },
        orderDetails: this.orderForm.value.orderDetails.map((detail: any) => ({
          productId: detail.product_id,
          quantity: detail.quantity
        }))
      };

      if (this.isEditMode && this.orderId) {
        this.orderService.updateOrder(this.orderId, orderData).subscribe(response => {
          console.log('Order updated', response);
          this.router.navigate(['/orders']);
        });
      } else {
        this.orderService.createOrder(orderData).subscribe(response => {
          console.log('Order created', response);
          this.router.navigate(['/orders']);
        });
      }
    }
  }
}
