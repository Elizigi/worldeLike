import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { LetterCell } from '../../model/letterInterfaceModel';

@Component({
  selector: 'app-letter-box',
  templateUrl: './letter-box.component.html',
  imports: [CommonModule],
  styleUrls: ['./letter-box.component.scss'],
})
export class LetterBoxComponent implements OnChanges {
  @Input() letterCell!: LetterCell 
  isFlipping = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['letterCell']) {
      const previousStatus = changes['letterCell'].previousValue?.status;
      const currentStatus = changes['letterCell'].currentValue?.status;
      
      if (previousStatus === '' && currentStatus && currentStatus !== '') {
        this.isFlipping = true;
        setTimeout(() => {
          this.isFlipping = false;
        }, 500);
      }
    }
  }
}
