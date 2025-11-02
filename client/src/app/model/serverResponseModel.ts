export interface ServerResponse {
  result: { letter: string; status: 'correct' | 'present' | 'absent' }[];
}
