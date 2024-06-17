import { Injectable } from '@angular/core';
import Editor from 'ckeditor5-custom-build/build/ckeditor';

@Injectable({
  providedIn: 'root',
})
export class Texteditor2Service {
  constructor() {}
  public Editor = Editor;
  public onReady(editor) {
    editor.ui.view.editable.element.parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.view.editable.element,
    );
  }
  configEditor = {
    placeholder: 'Escribe un comentario',
    language: 'es',
  };
}
