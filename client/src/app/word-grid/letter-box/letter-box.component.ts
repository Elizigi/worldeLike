import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LetterCell } from '../../model/letterInterfaceModel';

@Component({
  selector: 'app-letter-box',
  templateUrl: './letter-box.component.html',
  imports: [CommonModule],
  styleUrls: ['./letter-box.component.scss'],
})
export class LetterBoxComponent {
  @Input() letterCell: LetterCell = { letter: '', status: '' };
}
