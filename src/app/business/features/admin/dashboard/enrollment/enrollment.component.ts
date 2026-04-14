import { Component, signal, computed, inject, input, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../../../core/services/toast.service';
import { FilterUploadedPipe } from '../../../../utils/filter-uploaded.pipe';
import { SafeUrlPipe } from '../../../../utils/safe-url.pipe';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { QrGeneratorComponent } from '../../../../utils/qr-generator/qr-generator.component';
import { environment } from '../../../../../../environments/environment';
import { Alumno } from '../../../../../models/inscripcion/alumno.models';
import { Salud } from '../../../../../models/inscripcion/salud.models';
import { Tutor } from '../../../../../models/inscripcion/tutor.models';

interface EnrollmentDoc {
  nombre: string;
  clave: string;
  cargado: boolean;
  file?: File;
}


@Component({
  selector: 'app-enrollment',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterUploadedPipe, SafeUrlPipe, QrGeneratorComponent],
  templateUrl: './enrollment.component.html',
  styleUrl: './enrollment.component.css'
})
export class EnrollmentComponent {


  // ###### TUTOR ALUMNO ######
  // 1. Signal para el control principal (El Checkbox)
  esFamiliaExistente = signal<boolean>(false);
  // 2. Signals para la búsqueda
  terminoBusqueda = signal<string>('');
  buscando = signal<boolean>(false);
  mensajeBusqueda = signal<string>('');
  personasAutorizadas = signal<Tutor[]>([]);

// 3. Estado del Tutor que se está vinculando
  tutorActual = signal<Tutor>({
    id: 0, 
    nombre: '',
    apellidos: '',
    curp: '',
    parentesco: '',
    telefono: '',
    correo: '',
    autorizadoRetiro: true // Por defecto, el tutor principal puede retirar
  });

  // Función para alternar el checkbox y limpiar datos
  toggleFamiliaExistente() {
    this.esFamiliaExistente.set(!this.esFamiliaExistente());
    this.limpiarTutor();
    this.terminoBusqueda.set('');
    this.mensajeBusqueda.set('');
  }

  // Simulación de búsqueda en el backend
  buscarTutor() {
    if (this.terminoBusqueda().trim().length < 3) return;

    this.buscando.set(true);
    this.mensajeBusqueda.set('');

    // Simulando una llamada HTTP
    setTimeout(() => {
      if (this.terminoBusqueda().toLowerCase() === 'lopez') {
        // Encontramos al tutor, actualizamos el signal
        this.tutorActual.set({
          id: 1,
          nombre: 'Carlos',
          apellidos: 'López Hernández',
          curp: 'LOHC801010HDFRRN09',
          parentesco: 'Padre',
          telefono: '5512345678',
          correo: 'carlos@ejemplo.com',
          autorizadoRetiro: true
        });
        this.mensajeBusqueda.set('Tutor encontrado y vinculado.');
      } else {
        this.limpiarTutor();
        this.mensajeBusqueda.set('No se encontró ningún tutor con ese criterio.');
      }
      this.buscando.set(false);
    }, 1000);
  }

  limpiarTutor() {
    this.tutorActual.set({
      id: 0,
      nombre: '', apellidos: '', curp: '', parentesco: '', telefono: '', correo: '', autorizadoRetiro: true
    });
  }

  // Actualizador genérico para los inputs
  actualizarCampoTutor(campo: keyof Tutor, valor: any) {
    this.tutorActual.update(t => ({ ...t, [campo]: valor }));
  }

  agregarPersonaAutorizada() {
    if(this.personasAutorizadas().length >= 2) {
      this.toastService.show(
        'Límite alcanzado', 
        'Solo puedes agregar hasta 2 personas autorizadas, adicionales al Tutor Principal', 
        'warning');
    } else {
      const nuevaPersona: Tutor = {
      id: 0,
      nombre: '',
      apellidos: '',
      curp: '', // Opcional para secundarios
      parentesco: '',
      telefono: '',
      correo: '',
      autorizadoRetiro: true // Verdadero por defecto al estar en esta lista
    };
    // Usamos .update() para clonar el arreglo actual y añadir el nuevo objeto al final
    this.personasAutorizadas.update(listaActual => [...listaActual, nuevaPersona]);
    }
  }

  // 2. Método para actualizar un campo específico de una persona en el arreglo
  actualizarPersonaAutorizada(index: number, campo: keyof Tutor, valor: any) {
    this.personasAutorizadas.update(lista => {
      // Creamos una copia del arreglo
      const nuevaLista = [...lista];
      // Actualizamos solo la persona en el índice modificado
      nuevaLista[index] = { ...nuevaLista[index], [campo]: valor };
      return nuevaLista;
    });
  }

  // 3. Método para remover a la persona si el usuario se arrepiente
  eliminarPersonaAutorizada(index: number) {
    // Filtramos la lista para devolver todas las personas menos la del índice indicado
    this.personasAutorizadas.update(lista => lista.filter((_, i) => i !== index));
  }

   // ###### TUTOR ALUMNO ######

  // Datos básicos del alumno
  alumno = signal(new Alumno());


   salud = signal<Salud>({
    tipoSangre: '',
    alergias: '',
    discapacidades: '',
    necesidadesEspeciales: '',
    notasMedicas: ''
  });

  private userSettings = JSON.parse(localStorage.getItem('user_session') || '{}');
  private headers = new HttpHeaders({
      'Authorization': `Bearer ${this.userSettings.accessToken}`
    });

  private http = inject(HttpClient);

  // Señales nuevas para manejar las sugerencias
  sugerencias = signal<string[]>([]);
  usuarioSeleccionado = signal<string>('');
  cargandoSugerencias = signal<boolean>(false);

  private sanitizer = inject(DomSanitizer);

  value = input.required<string>();
  size = input<string>('150x150');

  searchTermPending = signal('');
  
  // Base de datos simulada de borradores (Vendría de: GET /api/inscripciones?status=PENDIENTE)
  pendingEnrollments = signal([
    { 
      folio: 'PRE-2026-001', 
      alumno: { nombre: 'Lucía', apellido: 'Méndez', curp: 'LUME01...', fechaNacimiento: '2018-05-12', genero: 'F', grado: '1' },
      salud: { tipoSangre: 'A+', alergias: 'Nueces', condiciones: '', seguro: 'privado' },
      documentos: [ /* array de documentos con cargado: true */ ]
    }
  ]);

  // Signal para controlar el modal de revisión
  isPreviewModalOpen = signal(false);
  
  // Estado de la inscripción: 'proceso' | 'pendiente' | 'completado'
  enrollmentStatus = signal<'proceso' | 'pendiente' | 'completado'>('proceso');

  @ViewChild('sigCanvas') canvas!: ElementRef<HTMLCanvasElement>;
  private ctx?: CanvasRenderingContext2D;
  private isDrawing = false;

  currentStep = signal(1); // Ahora llegaremos hasta el paso 6

  // Computed Signal: Reacciona automáticamente cuando cambia el nombre, apellido o fecha
  generatedUsername = computed(() => {
    const data = this.alumno();
    
    // Si no hay nombre o apellido paterno, no mostramos nada
    if (!data.nombre || !data.apellidoPaterno || !data.apellidoMaterno) {
      return '';
    }

    // Lógica sugerida: Primera letra del nombre + Apellido Paterno + Año de nacimiento
    // Ejemplo: Juan Perez (2010) -> jperez2010
    const inicialNombre = data.nombre.charAt(0).toLowerCase();
    
    // Tomamos solo la primera palabra del apellido paterno por si capturan compuestos
    const primerApellido = data.apellidoPaterno.trim().split(' ')[0].toLowerCase();
    // Tomamos solo la primera palabra del apellido paterno por si capturan compuestos
    const primerApellidoMaterno = data.apellidoMaterno.trim().split(' ')[0].toLowerCase();
    
    // Extraemos el año de la fecha de nacimiento (YYYY-MM-DD)
    const anio = data.fechaNacimiento ? data.fechaNacimiento.split('-')[0] : '';

    // Removemos acentos para evitar usuarios inválidos (opcional pero recomendado)
    const usuarioBruto = `${inicialNombre}${primerApellido}${primerApellidoMaterno}${anio}`;
    return usuarioBruto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  });

// Actualizador genérico (el que implementamos antes)
  actualizarCampo(campo: keyof Alumno, valor: string) {
    this.alumno.update(estado => ({ ...estado, [campo]: valor }));
  }

  contactosEmergencia = signal([
    { nombre: '', telefono: '', parentesco: '' },
    { nombre: '', telefono: '', parentesco: '' }
  ]);

  // Filtro reactivo para los borradores
  filteredPending = computed(() => {
    const term = this.searchTermPending().toLowerCase();
    if (!term) return [];
    return this.pendingEnrollments().filter(p => 
      p.alumno.nombre.toLowerCase().includes(term) || p.folio.toLowerCase().includes(term)
    );
  });

  // 3. Tutores y Recogida
  tutorExistente = signal<any | null>(null);

  // 4. Finanzas
  planPago = signal({
    tipo: 'completo', // beca, convenio, completo
    montoMensual: 0,
    pagoInicial: 1500
  });

  private toastService = inject(ToastService);

  //selectedPreview = signal<{url: string, type: string, nombre: string} | null>(null);
  selectedPreview = signal<{url: SafeResourceUrl, type: string, nombre: string} | null>(null);

  docsCargadosCount = computed(() => 
  this.documentos().filter(d => d.cargado).length
);

  // Checklist de documentos
  documentos = signal<EnrollmentDoc[]>([
    { nombre: 'Acta de Nacimiento', clave: 'acta', cargado: false },
    { nombre: 'CURP', clave: 'curp_doc', cargado: false },
    { nombre: 'Certificado de Grado Anterior', clave: 'certificado', cargado: false },
    { nombre: 'Comprobante de Domicilio', clave: 'domicilio', cargado: false },
    { nombre: 'INE (Padre / Tutor)', clave: 'ine', cargado: false },
    { nombre: 'Fotografía', clave: 'foto', cargado: false },
    { nombre: 'Cartilla vacunación', clave: 'vacunacion', cargado: false },
    { nombre: 'Certificado medico', clave: 'medico', cargado: false }
  ]);

  // Computed signal que reacciona si el valor cambia
  qrUrl = computed(() => {
    const data = encodeURIComponent(this.value());
    return `https://api.qrserver.com/v1/create-qr-code/?size=${this.size()}&data=${data}`;
  });

  nextStep() {
    console.log('Datos alumno:', this.alumno());
    console.log('Datos alumno salud:', this.salud());
    if (this.currentStep() < 6) this.currentStep.update(s => s + 1);
  }

  prevStep() {
    if (this.currentStep() > 1) this.currentStep.update(s => s - 1);
  }

  openReview() {
    this.isPreviewModalOpen.set(true);
  }

  exportToPDF() {
    this.toastService.show('Generando Resumen', 'Preparando ficha de pre-inscripción...', 'info');
    setTimeout(() => {
      window.print(); // Usaremos el media print que configuramos antes
    }, 500);
  }

  // Función para "Retomar" una inscripción pendiente
  resumePendingEnrollment() {
    this.currentStep.set(6); // Salto directo a la firma
    this.toastService.show('Modo Firma', 'Cargando datos previos para validación final.', 'success');
  }

  saveAsPending() {
    this.enrollmentStatus.set('pendiente');
    this.toastService.show(
      'Borrador Guardado', 
      'La información se ha guardado como pendiente. Podrá finalizar con la firma después.', 
      'info'
    );
    this.isPreviewModalOpen.set(false);
    // Aquí enviarías el objeto actual al backend con status = 'PENDIENTE'
  }

  onFileSelected(event: any, docClave: string) {
    const file = event.target.files[0];
    if (file) {
      // Crear URL local temporal para previsualización
      const localUrl = URL.createObjectURL(file);
      const fileType = file.type;

      this.documentos.update(docs => 
        docs.map(d => d.clave === docClave ? { 
          ...d, 
          cargado: true, 
          file: file,
          previewUrl: localUrl, // Guardamos la URL temporal
          type: fileType 
        } : d)
      );
    }
  }

  openPreview(doc: any) {
    if (doc.previewUrl) {
      this.selectedPreview.set({
        url: this.sanitizer.bypassSecurityTrustResourceUrl(doc.previewUrl),
        type: doc.type,
        nombre: doc.nombre
      });
    }
  }

  closePreview() {
    this.selectedPreview.set(null);
  }

  finalizarInscripcion() {
    this.toastService.show('Procesando', 'Guardando expediente completo...', 'info');
    
    // Simulación de envío al backend (Spring Boot)
    setTimeout(() => {
      this.toastService.show('¡Éxito!', 'Alumno inscrito y documentos guardados.', 'success');
      this.resetForm();
    }, 2000);
  }

  resetForm() {
    this.currentStep.set(1);
    this.alumno.set(new Alumno());
    this.documentos.update(docs => docs.map(d => ({ ...d, cargado: false, file: undefined })));
  }


  // --- LÓGICA DE FIRMA (CANVAS) ---
  ngAfterViewChecked() {
    if (this.currentStep() === 6 && !this.ctx && this.canvas) {
      this.initCanvas();
    }
  }

  initCanvas() {
    const canvas = this.canvas.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.ctx.strokeStyle = '#2c3e50';
    this.ctx.lineWidth = 2;
  }

  startDrawing(e: MouseEvent) {
    this.isDrawing = true;
    this.ctx?.beginPath();
    this.ctx?.moveTo(e.offsetX, e.offsetY);
  }

  draw(e: MouseEvent) {
    if (!this.isDrawing) return;
    this.ctx?.lineTo(e.offsetX, e.offsetY);
    this.ctx?.stroke();
  }

  stopDrawing() { this.isDrawing = false; }

  clearSignature() {
    this.ctx?.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }

  // FUNCIÓN CLAVE: Recuperar y saltar a la firma
  resumeEnrollment(draft: any) {
    // 1. Cargamos todos los datos en los signals del formulario
    this.alumno.set(draft.alumno);
    this.salud.set(draft.salud);
    // Nota: Aquí también cargarías los documentos y contactos de emergencia
    
    // 2. Cambiamos el estatus
    this.enrollmentStatus.set('proceso');

    // 3. SALTO DIRECTO AL PASO 6
    this.currentStep.set(6);

    this.toastService.show(
      'Borrador Cargado', 
      `Retomando inscripción de ${draft.alumno.nombre}. Listo para firma.`, 
      'success'
    );
    this.searchTermPending.set(''); // Limpiar buscador
  }

  solicitarSugerencias() {
    const base = this.generatedUsername();
    if (!base) return;
    this.cargandoSugerencias.set(true);
    this.http.get<any>(environment.urlHostSchool.concat(environment.urlServiceSugerenciasUsuario), { params : new HttpParams().set('username', base), headers: this.headers })
      .subscribe({
        next: (opciones) => {
          this.sugerencias.set(opciones.sugerencias);
          // Auto-seleccionamos la primera opción por defecto
          if (opciones.sugerencias.length > 0) {
            this.usuarioSeleccionado.set(opciones.sugerencias[0]);
          }
          this.cargandoSugerencias.set(false);
        },
        error: () => this.cargandoSugerencias.set(false)
      });
  }
  // Método para cuando el usuario hace clic en un "chip"
  elegirSugerencia(opcion: string) {
    this.alumno.set({ ...this.alumno(), username: opcion }); // Actualizamos el alumno con el username seleccionado
  }

}
