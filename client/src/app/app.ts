import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WordGridComponent } from './word-grid/word-grid.component';
import { KeyBoardComponent } from './keyboard/keyboard.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, WordGridComponent, KeyBoardComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('client');

  constructor() {
    this.changeTitle();
  }
  changeTitle() {
    this.title.set('Word Game');
  }
}
