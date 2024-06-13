import { Product } from '../models/product.model';

export interface Order {
    id: number; // El ID puede no estar presente al crear una nueva orden
    status: string;
    deliveryAddress: string;
    paymentMethod: string;
    userId: number;
    date?: Date; // La fecha puede ser opcional, ya que puede ser asignada por el servidor
    orderDetails: OrderItem[];
  }
  
  export interface OrderItem {
    productId: number;
    quantity: number;
    price?: number; // El precio puede ser opcional, dependiendo de la implementación
    product?: Product; // Agregar esta propiedad opcional
  }
  