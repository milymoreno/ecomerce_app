export interface Image {
  id: number;
  path: string;
  product_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  images: Image[];
  created_at: Date;
  updated_at: Date;
}
