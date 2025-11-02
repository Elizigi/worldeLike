export interface LetterCell {
  letter: string;
  status: 'correct' | 'present' | 'absent' | '';
}
export type StatusCell = 'correct' | 'present' | 'absent' | '';