import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-system-message',
  templateUrl: './system-message.component.html',
  imports: [CommonModule],
  styleUrls: ['./system-message.component.scss'],
})
export class SystemMessageComponent {
  @Input() message: string = '';
}
