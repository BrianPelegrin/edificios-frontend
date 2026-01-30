[
  {
    "id": "string",
    "nombre": "string",
    "direccion": "string",
    "provincia": "string",
    "municipio": "string",
    "edificios": [
      "string"
    ]
  }
]

export  interface IProject {
    id: string;
    nombre: string;
    direccion: string;
    provincia: string;
    municipio: string;
    edificios: string[]
}

export interface IApartment {
  id: number;
  codUnidad: string;
  edificio: string;
  unidad: string;
  metraje: number;
  estado: string;
  nombre: string;
  telefono: string;
  correo: string;
  cedula: string;
  precio: number;
  inicial: number | null;
  fechaCompletaInicial: string | null;
  inicialDolar: number;
  pagado: number;
  adeudado: number;
  iniciadoVaciados: boolean | null;
  fechaInicioVaciados: string | null;
  enInspeccion: boolean;
  fechaEntregaInspeccion: string | null;
  legal: boolean | null;
  responsableLegal: string;
  fechaLegal: string | null;
  gobierno: boolean | null;
  responsableGobierno: string;
  fechaGobierno: string | null;
  micelaneos: boolean | null;
  responsableMicelaneos: string;
  fechaMicelaneos: string | null;
  inspeccion1: boolean | null;
  fechaInspeccion1: string | null;
  inspeccion2: boolean | null;
  fechaInspeccion2: string | null;
  formaPago: string;
  fechaFormaPago: string | null;
  banco: string;
  saldo: boolean;
  entregada: boolean;
  titulo: string | null;
  descargadaDGII: boolean;
}