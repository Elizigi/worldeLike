import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WordGridComponent } from './word-grid/word-grid.component';
import { KeyBoardComponent } from './keyboard/keyboard.component';
import { HttpClient } from '@angular/common/http';
import { LetterCell, StatusCell } from './model/letterInterfaceModel';
import { SystemMessageComponent } from './system-message/system-message.component';
import { ServerResponse } from './model/serverResponseModel';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, WordGridComponent, KeyBoardComponent, SystemMessageComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
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

      return;
    }
    if (this.userWord().length === 5) return;
    this.userWord.set(this.userWord() + letter);
    this.guesses()[this.userWord().length - 1][this.row].letter = letter;
  }
  commitWord() {
    if (this.userWord().length === 5) {
      this.controlLocked = true;
      this.sendWord(this.userWord());
    }
  }
  private updateGuessAtPosition(colIndex: number, status: StatusCell) {
    const updatedGuesses = this.guesses().map((column, idx) =>
      column.map((cell, rowIdx) => {
        if (rowIdx === this.row && idx === colIndex) {
          return { ...cell, status };
        }
        return cell;
      })
    );
    this.guesses.set(updatedGuesses);
  }
  sendWord(word: string) {
    this.http.post<ServerResponse>('http://localhost:5000/validate', { word }).subscribe({
      next: (response) => {
        const resultsArray = response.result;

        for (const [index, result] of resultsArray.entries()) {
          setTimeout(() => {
            this.updateGuessAtPosition(index, result.status);
          }, index * 300);
        }

        setTimeout(() => {
          this.saveProgress();
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
        }, resultsArray.length * 200 + 600);
      },
      error: (err) => {
        if (err.message) {
          this.wordNotIn();
          return;
        }
        console.error('Request failed', err);
      },
    });
  }
  wordNotIn() {
    this.controlLocked = false;
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
  ngOnInit() {
    this.loadProgress();
  }

  loadProgress() {
    const savedProgress = localStorage.getItem('wordleProgress');
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      const today = new Date().toDateString();
      if (progress.date === today) {
        this.guesses.set(progress.guesses);

        this.row = this.guesses().some((col) => col.some((cell) => cell.status !== ''))
          ? this.guesses()[0].filter((cell) => cell.status !== '').length
          : 0;

        const lastCompletedRow = this.row - 1;
        if (lastCompletedRow >= 0) {
          const isWon = this.guesses().every((col) => col[lastCompletedRow]?.status === 'correct');
          const isLost = lastCompletedRow >= 5;

          if (isWon || isLost) {
            this.controlLocked = true;
          }
        }
      } else {
        localStorage.removeItem('wordleProgress');
      }
    }
  }

  saveProgress() {
    const progress = {
      guesses: this.guesses(),
      row: this.row,
      date: new Date().toDateString(),
    };
    localStorage.setItem('wordleProgress', JSON.stringify(progress));
  }
}
