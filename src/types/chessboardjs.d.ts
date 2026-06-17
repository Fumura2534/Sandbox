declare module 'chessboardjs' {
  export interface BoardConfig {
    [key: string]: any;
  }

  export default function ChessBoard(containerElOrId: any, config?: BoardConfig): any;
}
