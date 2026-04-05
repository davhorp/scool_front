export type UserRole = 'admin' | 'docente' | 'alumno' | 'padre';

export interface User {
  id: string;
  nombre: string;
  rol: UserRole;
}