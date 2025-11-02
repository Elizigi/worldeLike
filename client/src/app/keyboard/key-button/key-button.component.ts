import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-key-button',
  templateUrl: './key-button.component.html',
  imports: [CommonModule],
  styleUrls: ['./key-button.component.scss'],
})
export class KeyButtonComponent {
  @Input() key: string = '';
  @Input() status: 'correct' | 'absent' | '' = '';
  @Output() pressed = new EventEmitter<string>();

  handleClick() {
    this.pressed.emit(this.key);
  }
}
