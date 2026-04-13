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

interface EnrollmentDoc {
  nombre: string;
  clave: string;
  cargado: boolean;
  file?: File;
}

export interface Alumno {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: string; // Formato YYYY-MM-DD del input type="date"
  genero: string;
  correo: string;
  telefono: string;
}
export interface Salud {
  tipoSangre: string;
  alergias: string;
  discapacidades: string;
  necesidadesEspeciales: string; // Formato YYYY-MM-DD del input type="date"
  notasMedicas: string;
}

@Component({
  selector: 'app-enrollment',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterUploadedPipe, SafeUrlPipe, QrGeneratorComponent],
  templateUrl: './enrollment.component.html',
  styleUrl: './enrollment.component.css'
})
export class EnrollmentComponent {

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
    console.log('Generando usuario para:', this.currentStep);
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
  personasAutorizadas = signal([{ nombre: '', parentesco: '', foto: null as any }]);

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

  // Datos básicos del alumno
  alumno = signal<Alumno>({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    fechaNacimiento: '',
    genero: '',
    correo: '',
    telefono: ''
  });

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
    this.alumno.set({ nombre: '', apellidoMaterno: '', fechaNacimiento: '', genero: 'M', apellidoPaterno: '', correo: '', telefono: '' });
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
    this.usuarioSeleccionado.set(opcion);
  }

}
