import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-letter-box',
  templateUrl: './letter-box.component.html',
  imports: [CommonModule],
  styleUrls: ['./letter-box.component.scss'],
})
export class LetterBoxComponent {
  @Input() letter: string = '';
  @Input() status: 'correct' | 'present' | 'absent' | '' = '';
}
