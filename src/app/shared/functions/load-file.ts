export type TypeName =
  | 'pdf'
  | 'png'
  | 'jpg'
  | 'jpeg'
  | 'excel'
  | 'word'
  | 'csv'
  | 'zip'
  | 'wav'
  | 'mkv'
  | 'audio'
  | 'video';

interface FileTypes {
  accept: string;
  type: string;
}

export const FILE_TYPES: Readonly<Record<TypeName, FileTypes>> = {
  pdf: {
    accept: '.pdf',
    type: 'application/pdf',
  },
  png: {
    accept: '.png',
    type: 'image/png',
  },
  jpg: {
    accept: '.jpg',
    type: 'image/jpg',
  },
  jpeg: {
    accept: '.jpeg',
    type: 'image/jpeg',
  },
  excel: {
    accept: '.xlsx',
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  },
  word: {
    accept: '.docx',
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  },
  csv: {
    accept: '.csv',
    type: 'text/csv',
  },
  zip: {
    accept: '.zip, .rar',
    type: 'application/x-zip-compressed',
  },
  wav: {
    accept: '.wav',
    type: 'audio/wav ,audio/wave',
  },
  audio: {
    accept: '.mp3',
    type: 'audio/mpeg.',
  },
  mkv: {
    accept: '.mkv',
    type: 'video/x-matroska, audio/x-matroska',
  },
  video: {
    accept: '.mp4',
    type: 'video/mp4',
  },
};

export const ALL_FILE_TYPES = Object.values(FILE_TYPES).map((value) => value);

export const getAccepts = (accepts: TypeName[]) => accepts.map((name) => FILE_TYPES[name].accept);

export const getTypes = (types: TypeName[]) => types.map((name) => FILE_TYPES[name].type);

export interface LoadFile {
  type: string;
  name: string;
  file: ArrayBuffer;
  size?: number;
  origin?: File
}

/**
 *
 * @use only for one file
 */
export const loadFile = async (file: File, permittypes?: string[]): Promise<LoadFile> => {
  return new Promise((resolve, reject) => {
    if (file) {
      const fileProps: Partial<LoadFile> = {};
      let isPermitType = true;
      if (permittypes) isPermitType = permittypes?.some((type) => file.type.includes(type));
      else
        isPermitType = ALL_FILE_TYPES?.some((allowedFile) => file.type.includes(allowedFile.type));
      if (!isPermitType) reject(new Error('El tipo de archivo no es válido'));
      else if (file.size > 30000000)
        reject(new Error('El tamaño de archivo permitido no debe superar las 30 megas'));
      fileProps.name = file.name;
      fileProps.type = file.type;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        fileProps.file = event.target.result as ArrayBuffer;
        fileProps.origin = file
        resolve(fileProps as LoadFile);
      };
      reader.onerror = () => {
        reject(new Error('Error al leer el archivo'));
      };
    }
  });
};
