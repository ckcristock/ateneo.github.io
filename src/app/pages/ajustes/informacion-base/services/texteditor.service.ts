import { Injectable } from '@angular/core';
import Editor from 'ckeditor5-custom-build/build/ckeditor';

@Injectable({
  providedIn: 'root',
})
export class TexteditorService {
  constructor() {}
  public Editor = Editor;
  public onReady(editor) {
    editor.ui.view.editable.element.parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.view.editable.element,
    );
  }
  configEditor = {
    toolbar: {
      items: [
        '|',
        'heading',
        'bold',
        'italic',
        'link',
        'bulletedList',
        'numberedList',
        '|',
        'blockQuote',
        'undo',
        'redo',
      ],
    },
    language: 'es',
    placeholder: 'Ingresa la descripción',
  };
}
