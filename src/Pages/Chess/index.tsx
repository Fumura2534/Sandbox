import { useEffect } from 'react';
import jQuery from 'jquery';
import ChessBoard from 'chessboardjs';
import 'chessboardjs/www/css/chessboard.css'; 

declare global {
  interface Window {
    $: typeof jQuery;
    jQuery: typeof jQuery;
  }
}

export default function WelcomePage() {
  useEffect(() => {
    window.$ = jQuery;
    window.jQuery = jQuery;

    // CONFIGURATION : On indique l'adresse URL pour récupérer les pièces en ligne
    const config = {
      position: 'start',
      pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
    };

    // On passe la config à ChessBoard
    ChessBoard('my-board', config);
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Bienvenue sur mon jeu d'échecs !</h1>
      <div id="my-board" style={{ width: '400px' }}></div>
    </div>
  );
}
