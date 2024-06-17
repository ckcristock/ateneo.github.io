import { functionsUtils } from '../../../../core/utils/functionsUtils';
import { consts } from '../../../../core/utils/consts';
import { SwalService } from '../../../ajustes/informacion-base/services/swal.service';

export const helperLegalizar = {
  typesFiles: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],

  getImage: (event, myFile, model) => {
    if (event.target.files[0]) {
      let file = event.target.files[0];
      //50 kb
      let _swal = new SwalService();
      if (file.size > consts.maxSizeFile) {
        _swal.show({
          title: 'Archivo muy pesado',
          text: 'El máximo peso del archivo es : ' + consts.maxSizeFile / 1000 + ' KB',
          icon: 'error',
          showCancel: false,
        });

        model.file = '';
        myFile.nativeElement.value = '';
      } else if (!helperLegalizar.typesFiles.includes(file.type)) {
        _swal.show({
          title: 'Formato Incorrecto',
          text: 'Debe adjuntar un archivo .PDF',
          icon: 'error',
          showCancel: false,
        });
        myFile.nativeElement.value = '';
        model.file = '';
      } else {
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (event) => {
          let fileString = (<FileReader>event.target).result;
          const type = { ext: fileString };
        };
        functionsUtils.fileToBase64(file).subscribe((base64) => {
          model.file = base64;
        });
      }
    }
  },
};
