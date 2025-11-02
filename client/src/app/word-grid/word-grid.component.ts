import { Component } from '@angular/core';
import { LetterBoxComponent } from './letter-box/letter-box.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-word-grid',
  templateUrl: './word-grid.component.html',
  imports: [LetterBoxComponent, CommonModule],
  styleUrls: ['./word-grid.component.scss'],
})
export class WordGridComponent {
  guesses: string[][] = Array.from({ length: 5 }, () => new Array(6).fill('T'));
}
