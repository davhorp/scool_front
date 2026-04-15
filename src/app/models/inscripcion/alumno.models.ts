import { Salud } from "./salud.models";
import { Tutor } from "./tutor.models";

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
}