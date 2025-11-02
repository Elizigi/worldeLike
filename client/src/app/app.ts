import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WordGridComponent } from './word-grid/word-grid.component';
import { KeyBoardComponent } from './keyboard/keyboard.component';
import { HttpClient } from '@angular/common/http';
import { LetterCell } from './model/letterInterfaceModel';
import { SystemMessageComponent } from './system-message/system-message.component';
import { ServerResponse } from './model/serverResponseModel';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, WordGridComponent, KeyBoardComponent, SystemMessageComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('client');
  protected readonly userWord = signal('');
  protected readonly message = signal('');

  guesses = signal<LetterCell[][]>(
    Array.from({ length: 5 }, () => Array.from({ length: 6 }, () => ({ letter: '', status: '' })))
  );

  row: number = 0;
  controlLocked = false;

  constructor(private readonly http: HttpClient) {
    this.changeTitle();
  }
  changeTitle() {
    this.title.set('Word Game');
  }
  addLetter(letter: string) {
    if (this.controlLocked) return;
    if (letter === 'Enter') {
      this.commitWord();
      return;
    }
    if (letter === '↩') {
      this.userWord.set(this.userWord().slice(0, -1));
      this.guesses()[this.userWord().length][this.row].letter = '';

      console.log('delete');
      return;
    }
    if (this.userWord().length === 5) return;
    this.userWord.set(this.userWord() + letter);
    this.guesses()[this.userWord().length - 1][this.row].letter = letter;
    console.log(this.userWord());
  }
  commitWord() {
    if (this.userWord().length === 5) {
      this.controlLocked = true;
      console.log('committing');
      this.sendWord(this.userWord());
    }
  }
  sendWord(word: string) {
    console.log('sending');

    this.http.post<ServerResponse>('http://localhost:5000/validate', { word }).subscribe({
      next: (response) => {
        const resultsArray = response.result;
        console.log('received');
        console.log('checking for row', this.row);
        const updatedGuesses = this.guesses().map((column, colIndex) =>
          column.map((cell, rowIndex) => {
            if (rowIndex === this.row) {
              return {
                ...cell,
                status: resultsArray[colIndex].status,
              };
            }
            return cell;
          })
        );

        this.guesses.set(updatedGuesses);

        const rightLetters = resultsArray.filter((l) => l.status === 'correct').length;
        if (rightLetters === 5) {
          this.gameWin();
          return;
        }
        if (this.row >= 5) {
          this.gameOver();
          return;
        }
        this.nextRound();
      },
      error: (err) => {
        if (err.message) return this.wordNotIn();
        console.error('Request failed', err);
      },
    });
  }
  wordNotIn() {
    this.controlLocked = false;
    console.log('smh!');
    this.showSystemMessage('word not in collection');
  }
  gameWin() {
    const amountOfClutch = this.row;
    if (amountOfClutch === 0) {
      this.showSystemMessage(' LUCKY! ');
      return;
    }
    if (amountOfClutch < 2) {
      this.showSystemMessage(' EZ PEASY ');
      return;
    }
    if (amountOfClutch < 5) {
      this.showSystemMessage(' Well Done ');
      return;
    }
    if (amountOfClutch === 5) this.showSystemMessage(' Phew ');
  }
  gameOver() {
    this.showSystemMessage(' GAME OVER ');
  }
  nextRound() {
    this.controlLocked = false;
    this.row++;
    this.userWord.set('');
  }
  showSystemMessage(message: string) {
    this.message.set(message);
    setTimeout(() => this.message.set(''), 2500);
  }
}
