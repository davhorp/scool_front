import { Salud } from "./salud.models";
import { Tutor } from "./tutor.models";

export interface DocumentoAlumno {
  clave: string;        // Ej: 'acta_nacimiento', 'curp'
  nombre: string;       // Ej: 'Acta de Nacimiento'
  cargado: boolean;
  file?: File;          // El archivo real para subir al servidor
  previewUrl?: string;  // La URL temporal para el <img> o <iframe>
  type?: string;        // MIME type (image/png, application/pdf, etc)
}

export class Alumno {
  nombre = '';
  apellidoPaterno = '';
  apellidoMaterno = '';
  fechaNacimiento = ''; // Formato YYYY-MM-DD del input type="date"
  username = '';
  genero = '';
  correo = '';
  telefono = '';
  salud = new Salud();
  tutor = new Tutor();
  personasAutorizadas: Tutor[] = [];
  // Lista de documentos requeridos
  documentos: DocumentoAlumno[] = [
    { nombre: 'Acta de Nacimiento', clave: 'acta', cargado: false },
    { nombre: 'CURP', clave: 'curp_doc', cargado: false },
    { nombre: 'Certificado de Grado Anterior', clave: 'certificado', cargado: false },
    { nombre: 'Comprobante de Domicilio', clave: 'domicilio', cargado: false },
    { nombre: 'INE (Padre / Tutor)', clave: 'ine', cargado: false },
    { nombre: 'Fotografía', clave: 'foto', cargado: false },
    { nombre: 'Cartilla vacunación', clave: 'vacunacion', cargado: false },
    { nombre: 'Certificado medico', clave: 'medico', cargado: false }
  ];
}