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

    // CONFIGURATION AVEC DRAG AND DROP
    const config = {
      position: 'start',
      draggable: true, // 👈 C'est cette ligne qui active le Glisser-Déposer !
      pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',
      
      // Optionnel : Empêche de glisser les pièces en dehors de l'échiquier
      dropOffBoard: 'snapback', // 'trash' fait disparaître la pièce, 'snapback' (par défaut) la remet à sa place
    } as const;

    // Initialisation
    ChessBoard('my-board', config);
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Bienvenue sur mon jeu d'échecs !</h1>
      <p>Astuce : Vous pouvez maintenant glisser et déposer les pièces.</p>
      <div id="my-board" style={{ width: '400px' }}></div>
    </div>
  );
}