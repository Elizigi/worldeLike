import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyButtonComponent } from './key-button/key-button.component';
import { letterInputModel } from '../model/letterInputModel';

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  imports: [CommonModule, KeyButtonComponent],
  styleUrls: ['./keyboard.component.scss'],
})
export class KeyBoardComponent {
  keys: string[][] = letterInputModel;
  @Output() pressed = new EventEmitter<string>();

  onKeyPressed(letter: string) {
    this.pressed.emit(letter);
  }
}
