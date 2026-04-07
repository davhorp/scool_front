import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../../../core/services/toast.service';
import { UserService } from '../../../../../core/services/user.service';

interface User {
  id: number;
  nombre: string;
  correo: string;
  rol: 'admin' | 'docente' | 'alumno' | 'tutor';
  estado: 'activo' | 'inactivo';
  bloqueado?: boolean; // Para simular bloqueo por intentos fallidos
}

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent {

  // Signal para el rol del usuario logueado (esto vendría de tu servicio de Auth)
currentUserRole = signal<'admin' | 'docente' | 'alumno'>('admin');

  isEditing = signal(false);
  editBuffer = signal<any>({});
  usrService = inject(UserService);
  // Signal para controlar qué usuario se está viendo
  selectedUserForDetail = signal<any | null>(null);
  private toastService = inject(ToastService);
  // Signal para el maestro seleccionado
  selectedTeacherForStudents = signal<any | null>(null);

  // Signal para la lista de alumnos (puedes cargarla desde un servicio)
  teacherStudents = signal<any[]>([]);

  // Control del Modal
  isAddModalOpen = signal(false);

  // Estado inicial del nuevo usuario
  newUser = signal({
    nombre: '',
    correo: '',
    rol: 'alumno' as const,
    estado: 'activo' as const
  });

  // Signals de estado
  searchTerm = signal('');
  roleFilter = signal('todos');
  
  // Datos simulados
  users = signal<User[]>([
    { id: 1, nombre: 'Admin General', correo: 'admin&#64;escuela.edu.mx', rol: 'admin', estado: 'activo', bloqueado: true },
    { id: 2, nombre: 'Prof. Roberto Gómez', correo: 'rgomez&#64;escuela.edu.mx', rol: 'docente', estado: 'activo', bloqueado: false  },
    { id: 3, nombre: 'Lucía Fernández', correo: 'lucia.f&#64;alumno.edu.mx', rol: 'alumno', estado: 'activo', bloqueado: false },
    { id: 4, nombre: 'Pedro Ortiz (Padre)', correo: 'portiz&#64;tutor.com', rol: 'tutor', estado: 'inactivo', bloqueado: false },
  ]);

  // Filtro Reactivo
  filteredUsers = computed(() => {
    return this.users().filter(user => {
      const matchesSearch = user.nombre.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
                            user.correo.toLowerCase().includes(this.searchTerm().toLowerCase());
      const matchesRole = this.roleFilter() === 'todos' || user.rol === this.roleFilter();
      return matchesSearch && matchesRole;
    });
  });

  openAddModal() {
    this.isAddModalOpen.set(true);
  }

  closeAddModal() {
    this.isAddModalOpen.set(false);
    // Resetear formulario
    this.newUser.set({ nombre: '', correo: '', rol: 'alumno', estado: 'activo' });
  }

  deleteUser(user: User) {
    if (confirm(`¿Estás seguro de eliminar a ${user.nombre}?`)) {
      this.users.update(list => list.filter(u => u.id !== user.id));
      this.toastService.show('Usuario Eliminado', 'El registro ha sido removido.', 'warning');
    }
  }

  toggleStatus(user: User) {
    const newStatus = user.estado === 'activo' ? 'inactivo' : 'activo';
    this.users.update(list => list.map(u => u.id === user.id ? { ...u, estado: newStatus } : u));
    this.toastService.show('Estado Actualizado', `${user.nombre} ahora está ${newStatus}`, 'info');
  }

  getGradeClass(nota: number): string {
  if (nota >= 9) return 'grade-excellent';
  if (nota >= 7) return 'grade-good';
  return 'grade-danger';
}

  saveUser() {
    const data = this.newUser();
    
    // Validación básica
    if (!data.nombre || !data.correo) {
      this.toastService.show('Campos incompletos', 'Nombre y correo son obligatorios', 'error');
      return;
    }

    // Crear el nuevo registro con un ID único
    const newEntry = {
      ...data,
      id: Date.now(), // ID temporal basado en timestamp
    };

    // Actualizar la lista de usuarios (el computed filteredUsers reaccionará solo)
    this.users.update(current => [newEntry, ...current]);

    this.toastService.show(
      'Usuario Creado', 
      `${data.nombre} ha sido registrado como ${data.rol.toUpperCase()}`, 
      'success'
    );

    this.closeAddModal();
  }

  openDetailsModal(user: any) {
  this.selectedUserForDetail.set(user);
  this.isEditing.set(false);
}

// Inicia la edición copiando los datos al buffer
enableEdit() {
  this.editBuffer.set({ ...this.selectedUserForDetail() });
  this.isEditing.set(true);
}

closeDetailsModal() {
  this.selectedUserForDetail.set(null);
}

// Cancela y limpia
cancelEdit() {
  this.isEditing.set(false);
}

// Guarda los cambios (Aquí llamarías a tu servicio de API)
saveChanges() {
  const updatedData = this.editBuffer();
  console.log('Enviando a API:', updatedData);
  
  // Simulación de actualización exitosa:
  // this.userService.update(updatedData).subscribe(...)
  
  this.selectedUserForDetail.set(updatedData); // Actualiza la vista local
  this.isEditing.set(false);
}

viewTeacherStudents(teacher: any) {
  this.selectedTeacherForStudents.set(teacher);
  // Aquí llamarías a tu servicio: 
  // this.studentService.getByTeacher(teacher.id).subscribe(data => this.teacherStudents.set(data));
  
  // Datos de prueba:
  this.teacherStudents.set([
    { id: 'AL-101', nombre: 'Carlos Ruiz', grado: '6to', seccion: 'A', estado: 'activo' },
    { id: 'AL-105', nombre: 'Ana Beltrán', grado: '6to', seccion: 'A', estado: 'activo' }
  ]);
}

  /*unlockUser(user: User) {
  // Llamada al servicio que pone bloqueado = false e intentos_fallidos = 0
  this.usrService.desbloquear(user.id).subscribe(() => {
    this.users.update(list => list.map(u => 
      u.id === user.id ? { ...u, bloqueado: false, intentosFallidos: 0 } : u
    ));
    this.toastService.show('Usuario Desbloqueado', `${user.nombre} ya puede intentar loguearse.`, 'success');
  });

}*/

}
