import { FormBuilder } from '@angular/forms';

export const productoForm = {
  createForm(fb: FormBuilder) {
    let group = fb.group({
      Id_Producto: [''],
      Id_Categoria_Nueva: [''],
      Id_Subcategoria: [''],
      Principio_Activo: [''],
      Descripcion: [''],
      Codigo_Barras: [''],
      Invima: [''],
      Tipo: ['Generico'],
      dynamic: this.fb.group({
        id: [''],
      }),
    });

    return group;
  },
};
