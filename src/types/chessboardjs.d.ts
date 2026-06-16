import type { ChessBoardFactory } from '@types/chessboardjs';

declare module 'chessboardjs' {
  const ChessBoard: ChessBoardFactory;
  export default ChessBoard;
}
