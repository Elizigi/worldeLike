import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyButtonComponent } from './key-button/key-button.component';

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  imports: [CommonModule, KeyButtonComponent],
  styleUrls: ['./keyboard.component.scss'],
})
export class KeyBoardComponent {
  keys: string[][] = Array.from({ length: 3 }, () => new Array(6).fill('a'));
}
