import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/models/producto.model';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-form-productos',
  templateUrl: './form-productos.component.html',
  styleUrls: ['./form-productos.component.css']
})
export class FormProductosComponent implements OnInit {

  private path = 'products/'

  constructor(public firestoreService: AuthService,
              public storageService: StorageService) { }

  ngOnInit(): void {
    this.getProductos()
  }

  newImage=''
  newFile= ''


  productos: Producto[] = [];
  newProducto: Producto = {
    nombre:'',
    precio:0,
    description:'',
    foto:'',
    id:this.firestoreService.getId(),
    fecha: new Date,
  }

 async guardarProducto(){
    this.firestoreService.createDoc(this.newProducto, this.path, this.newProducto.id)
    const path = 'Productos';
    const name = 'prueba'
    const res = await this.storageService.uploadImageService(this.newFile, path, name);
    this.newProducto.foto = res;
    this.firestoreService.createDoc(this.newProducto, this.path, this.newProducto.id).then(res => {
      console.log('guado con exito', res)
    }).catch(error => {
      console.log('no se puede guardar', error)
    })

  }

  getProductos() {
    this.firestoreService.getCollection<Producto>(this.path).subscribe(res => {
    this.productos = res
    })
  }
  deleteProduct(producto: Producto){
    this.firestoreService.deleteDoc(this.path, producto.id);
  }

 async uploadImage(event:any){
    this.newFile = event.target.files[0];
    if(event.target.files && event.target.files[0]){
      const reader = new FileReader();
      reader.onload = ((image) => {
        this.newImage = image.target?.result as string;
      });
      reader.readAsDataURL(event.target.files[0]);
    }
  }
}