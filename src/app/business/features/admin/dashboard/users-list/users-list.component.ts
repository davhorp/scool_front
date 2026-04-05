import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../../../core/services/toast.service';

interface User {
  id: number;
  nombre: string;
  correo: string;
  rol: 'admin' | 'docente' | 'alumno' | 'tutor';
  estado: 'activo' | 'inactivo';
}

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent {

  private toastService = inject(ToastService);

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
    { id: 1, nombre: 'Admin General', correo: 'admin&#64;escuela.edu.mx', rol: 'admin', estado: 'activo' },
    { id: 2, nombre: 'Prof. Roberto Gómez', correo: 'rgomez&#64;escuela.edu.mx', rol: 'docente', estado: 'activo' },
    { id: 3, nombre: 'Lucía Fernández', correo: 'lucia.f&#64;alumno.edu.mx', rol: 'alumno', estado: 'activo' },
    { id: 4, nombre: 'Pedro Ortiz (Padre)', correo: 'portiz&#64;tutor.com', rol: 'tutor', estado: 'inactivo' },
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

}
