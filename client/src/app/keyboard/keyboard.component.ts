import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyButtonComponent } from './key-button/key-button.component';
import { letterInputModel } from '../model/letterInputModel';
import { StatusCell } from '../model/letterInterfaceModel';

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  imports: [CommonModule, KeyButtonComponent],
  styleUrls: ['./keyboard.component.scss'],
})
export class KeyBoardComponent {
  @Output() pressed = new EventEmitter<string>();
  @Input() keyboardStatus!: Map<string, StatusCell>;
   protected readonly letterInput = letterInputModel;

  clickLetter(letter: string) {
    this.pressed.emit(letter);
  }
  
getLetterStatus(letter: string): StatusCell {
  return this.keyboardStatus?.get(letter.toUpperCase()) || '';
}

}
