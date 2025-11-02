import { Component, Input } from '@angular/core';
import { LetterBoxComponent } from './letter-box/letter-box.component';
import { CommonModule } from '@angular/common';
import { LetterCell } from '../model/letterInterfaceModel';

@Component({
  selector: 'app-word-grid',
  templateUrl: './word-grid.component.html',
  imports: [LetterBoxComponent, CommonModule],
  styleUrls: ['./word-grid.component.scss'],
})
export class WordGridComponent {
  @Input() guesses: LetterCell[][]= [];
}
