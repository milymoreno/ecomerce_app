import { Component, OnInit } from '@angular/core';
import { Image, Product } from '../models/product.model';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  newProduct: Product = {
    id: 0, // Inicialmente en 0, se debe asignar en el backend
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    images: [],
    created_at: new Date(),
    updated_at: new Date()
  };
  selectedProduct: Product | null = null;

  selectedImage: string | ArrayBuffer | null = null;

  selectedImagePreviews: string[] = [];

  selectedFiles: File[] = [];


  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(products => {
      console.error('Lista de productos:', products);
      this.products = products;
    });
  }

  /*addProduct(): void {
    const images: Image[] = [];
    this.productService.createProduct(this.newProduct).subscribe(product => {
      product.images = images;
      console.log(this.newProduct);
      console.log(JSON.stringify(this.newProduct, null, 2));
      this.products.push(product);
      this.resetNewProduct();
      
    });
  }*/
  addProduct(): void {
    const formData = new FormData();
  
    // Agregar los datos del producto al FormData
    formData.append('name', this.newProduct.name);
    formData.append('description', this.newProduct.description);
    formData.append('price', this.newProduct.price.toString());
    formData.append('quantity', this.newProduct.quantity.toString());
  
    // Agregar las imágenes al FormData
    for (let i = 0; i < this.selectedFiles.length; i++) {
      formData.append('images[]', this.selectedFiles[i]);
    }
  
    this.productService.createProduct(formData).subscribe(
      (response) => {
        console.log(response);
        this.products.push(response);
        this.resetNewProduct();
      },
      (error) => {
        console.error('Error al agregar el producto:', error);
      }
    );
  }
   
  /*updateProduct(): void {
    if (this.selectedProduct) {
      this.productService.updateProduct(this.selectedProduct).subscribe(updatedProduct => {
        const index = this.products.findIndex(p => p.id === updatedProduct.id);
        if (index !== -1) {
          this.products[index] = updatedProduct;
        }
        this.selectedProduct = null;
      });
    }
  }*/

  updateProduct(): void {
    if (!this.selectedProduct) {
      return;
    }
        
    const formData = new FormData();
    formData.append('id', this.selectedProduct.id.toString());
    formData.append('name', this.selectedProduct.name);
    formData.append('description', this.selectedProduct.description);
    formData.append('price', this.selectedProduct.price.toString());
    formData.append('quantity', this.selectedProduct.quantity.toString());

    for (let i = 0; i < this.selectedFiles.length; i++) {
      formData.append('images[]', this.selectedFiles[i]);
    }

    this.productService.updateProduct(this.selectedProduct.id, formData).subscribe(
      (response) => {
        const index = this.products.findIndex(p => p.id === this.selectedProduct!.id);
        this.products[index] = response;
        this.resetNewProduct();
      },
      (error) => {
        console.error('Error al actualizar el producto:', error);
      }
    );

    //this.selectedProduct = null;
    //this.clearForm();
  }

  clearForm() {
    // Limpiar los campos del formulario
    this.selectedProduct = {
      id: 0,
      name: '',
      description: '',
      price: 0,
      quantity: 0,
      images: [],
      created_at: new Date (),
      updated_at: new Date ()
    };
  }

  deleteProduct(productId: number): void {
    this.productService.deleteProduct(productId).subscribe(() => {
      this.products = this.products.filter(p => p.id !== productId);
    });
  }

  selectProduct(product: Product): void {
    this.selectedProduct = { ...product };
    this.selectedImagePreviews = product.images.map(image => this.replacePublicWithStorage(image.path));
  }

  deleteImage(image: Image): void {
    if (!this.selectedProduct) {
      return;
    }

    this.productService.deleteImage(this.selectedProduct.id, image.id).subscribe(
      () => {
        const index = this.selectedProduct!.images.findIndex(img => img.id === image.id);
        if (index !== -1) {
          this.selectedProduct!.images.splice(index, 1);
          this.selectedImagePreviews.splice(index, 1);
        }
      },
      (error) => {
        console.error('Error al eliminar la imagen:', error);
      }
    );
  }

  resetNewProduct(): void {
    this.newProduct = {
      id: 0,
      name: '',
      description: '',
      price: 0,
      quantity: 0,
      images: [],
      created_at: new Date(),
      updated_at: new Date()
    };
    this.selectedFiles = [];
    this.selectedImagePreviews = [];
    // Opcional: Restablece el input de archivo
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  addImage(path: string): void {
    const image: Image = {
      id: 0, // Inicialmente en 0, se debe asignar en el backend
      path,
      product_id: this.selectedProduct ? this.selectedProduct.id : this.newProduct.id,
      created_at: new Date(),
      updated_at: new Date()
    };
    if (this.selectedProduct) {
      this.selectedProduct.images.push(image);
    } else {
      this.newProduct.images.push(image);
    }
  }

  removeImage(index: number): void {
    if (this.selectedProduct) {
      this.selectedProduct.images.splice(index, 1);
    } else {
      this.newProduct.images.splice(index, 1);
    }
  }
  // Función para reemplazar 'public' por 'storage' en las rutas de las imágenes
  replacePublicWithStorage(imagePath: string): string {
    return imagePath.replace('public', 'http://localhost:8000/storage');
  }
   
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
      this.selectedImage = reader.result;
    };
    reader.readAsDataURL(file);
    }
  }
   
  onFilesSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files) {
      this.selectedFiles = [];
      this.selectedImagePreviews = [];
      for (let i = 0; i < files.length; i++) {
        this.selectedFiles.push(files[i]);
        const imageUrl = URL.createObjectURL(files[i]);
        this.selectedImagePreviews.push(imageUrl);
      }
    }
  }
  
  cancelEdit() {
    this.selectedProduct = null; // Establece selectedProduct en null para cerrar el formulario de edición
   
  }
 
}
