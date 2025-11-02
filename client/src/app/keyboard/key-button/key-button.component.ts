import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-key-button',
  templateUrl: './key-button.component.html',
  imports: [CommonModule],
  styleUrls: ['./key-button.component.scss'],
})
export class KeyButtonComponent {
  @Input() key: string = '';
  @Input() status: 'correct' | 'absent' | '' = '';
}
