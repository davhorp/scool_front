import { Component, input, output } from '@angular/core';
import { Toast } from '../../../models/toast.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent {

  data = input.required<Toast>();
  close = output<number>();

}
