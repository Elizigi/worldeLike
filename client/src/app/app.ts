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
  protected readonly userWord = signal('');
  guesses: string[][] = Array.from({ length: 5 }, () => new Array(6).fill(''));
  row: number = 0;

  constructor() {
    this.changeTitle();
  }
  changeTitle() {
    this.title.set('Word Game');
  }
  addLetter(letter: string) {
    if (letter === 'Enter') {
      this.commitWord();
      return;
    }
    if (letter === '↩') {
      this.userWord.set(this.userWord().slice(0, -1));
      this.guesses[this.userWord().length][this.row] = '';

      console.log('delete');
      return;
    }
    if (this.userWord().length === 5) return;
    this.userWord.set(this.userWord() + letter);
    this.guesses[this.userWord().length - 1][this.row] = letter;
    console.log(this.userWord());
  }
  commitWord() {
    if (this.row !== 5 && this.userWord().length === 5) {
      this.row++;
      this.userWord.set('');
    }
  }
}
