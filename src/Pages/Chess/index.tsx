import { useEffect, useRef, useState } from 'react';
import jQuery from 'jquery';
import ChessBoard from 'chessboardjs';
import { Chess } from 'chess.js'; 
import 'chessboardjs/www/css/chessboard.css'; 

declare global {
  interface Window {
    $: typeof jQuery;
    jQuery: typeof jQuery;
  }
}

const pieceThemeMap = import.meta.glob('../../img/chesspieces/dbz/*.png', { eager: true, as: 'url' }) as Record<string, string>;
const getPieceTheme = (piece: string) => pieceThemeMap[`../../img/chesspieces/dbz/${piece}.png`] ?? '';

export default function WelcomePage() {
  const chessRef = useRef(new Chess());
  const boardRef = useRef<any>(null);

  // --- ÉTATS REACT POUR L'INTERFACE ---
  const [turn, setTurn] = useState<'w' | 'b'>('w');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  // Mettre à jour les infos de la partie dans l'interface React
  const updateGameStatus = () => {
    const game = chessRef.current;
    setTurn(game.turn());

    if (game.isGameOver()) {
      setIsGameOver(true);
      if (game.isCheckmate()) {
        const winner = game.turn() === 'w' ? 'Noirs' : 'Blancs';
        setStatusMessage(`🏆 Échec et mat ! Victoire des ${winner}.`);
      } else if (game.isDraw()) {
        setStatusMessage('🤝 Match nul !');
      } else {
        setStatusMessage('Fin de la partie.');
      }
    } else {
      setIsGameOver(false);
      setStatusMessage(game.inCheck() ? '⚠️ Roi en échec !' : '');
    }
  };

  // --- FONCTION DE RÉINITIALISATION ---
  const handleRestart = () => {
    chessRef.current.reset(); // Réinitialise le moteur de jeu
    if (boardRef.current) {
      boardRef.current.start(); // Réinitialise l'échiquier visuel
    }
    updateGameStatus(); // Réinitialise l'interface utilisateur
  };

  useEffect(() => {
    window.$ = jQuery;
    window.jQuery = jQuery;

    const game = chessRef.current;

    // --- UTILITAIRES POUR LA SURBRILLANCE ---
    const removeYellowSquares = () => {
      window.$('#my-board .square-55d63').css('background', '');
    };

    const yellowSquare = (square: string) => {
      const $square = window.$('#my-board .square-' + square);
      let background = '#fff3a1'; 
      if ($square.hasClass('black-3c85d')) {
        background = '#e6c645';
      }
      $square.css('background', background);
    };

    const onMouseoverSquare = (square: string, _piece: string) => {
      // Bloquer la surbrillance si c'est au tour du robot de jouer
      if (game.turn() === 'b') return;

      const moves = game.moves({ square: square as any, verbose: true });
      if (moves.length === 0) return;

      yellowSquare(square);
      for (let i = 0; i < moves.length; i++) {
        yellowSquare(moves[i].to);
      }
    };

    const onMouseoutSquare = (_square: string, _piece: string) => {
      removeYellowSquares();
    };

    // --- LOGIQUE DU ROBOT ALÉATOIRE ---
    const makeRandomMove = () => {
      // Sécurité : Ne rien faire si la partie est finie ou si ce n'est pas aux Noirs
      if (game.isGameOver() || game.turn() !== 'b') return;

      // 1. Récupérer tous les coups légaux possibles
      const possibleMoves = game.moves();

      // S'il n'y a pas de coups possibles, on arrête (normalement géré par isGameOver)
      if (possibleMoves.length === 0) return;

      // 2. Choisir un coup au hasard avec Math.random()
      const randomIndex = Math.floor(Math.random() * possibleMoves.length);
      const randomMove = possibleMoves[randomIndex];

      // 3. Exécuter le coup dans le moteur de jeu
      game.move(randomMove);

      // 4. Mettre à jour l'échiquier visuel et l'interface utilisateur
      if (boardRef.current) {
        boardRef.current.position(game.fen());
      }
      updateGameStatus();
    };

    // --- ÉVÉNEMENTS DU JOUEUR ---
    const onDragStart = (_source: string, piece: string, _position: any, _orientation: string) => {
      if (game.isGameOver()) return false;

      // Bloquer le joueur s'il essaie de bouger pendant le tour du robot (Noirs)
      if (game.turn() === 'b') return false;

      // Interdire de bouger les pièces noires (le joueur est forcément Blancs)
      if (piece.search(/^b/) !== -1) return false;
    };

    const onDrop = (source: string, target: string) => {
      const piece = game.get(source as any);
      const isPawn = piece && piece.type === 'p';
      const isPromotionRow = target.endsWith('8') || target.endsWith('1');
      
      let promotionPiece = undefined;

      if (isPawn && isPromotionRow) {
        const choice = prompt("En quoi voulez-vous promouvoir votre pion ? (q: Reine, r: Tour, b: Fou, n: Cavalier)", "q");
        if (choice && ['q', 'r', 'b', 'n'].includes(choice.toLowerCase())) {
          promotionPiece = choice.toLowerCase();
        } else {
          promotionPiece = 'q'; 
        }
      }

      try {
        const move = game.move({
          from: source,
          to: target,
          promotion: promotionPiece
        });

        if (move === null) return 'snapback';
        
        // Mettre à jour le statut après le coup du joueur Blanc
        updateGameStatus();

        // 5. DÉLAI DE 500MS : Si la partie continue, faire jouer le robot Noir
        if (!game.isGameOver()) {
          setTimeout(makeRandomMove, 500);
        }

      } catch (error) {
        return 'snapback';
      }
    };

    const onSnapEnd = () => {
      if (boardRef.current) {
        boardRef.current.position(game.fen());
      }
    };

    const config: import('chessboardjs').BoardConfig = {
      position: 'start',
      draggable: true,
      pieceTheme: (piece: string) => getPieceTheme(piece),
      dropOffBoard: 'snapback',
      onDragStart: onDragStart,
      onDrop: onDrop,
      onSnapEnd: onSnapEnd,
      onMouseoverSquare: onMouseoverSquare,
      onMouseoutSquare: onMouseoutSquare,
    };

    boardRef.current = ChessBoard('my-board', config);

    updateGameStatus();

    return () => {
      if (boardRef.current) {
        boardRef.current.destroy();
      }
    };
  }, []);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>♟️ Zone d'Échecs Réels</h1>
      </header>

      <main style={styles.gameLayout}>
        <div style={styles.boardContainer}>
          <div id="my-board" style={styles.board}></div>
        </div>

        <aside style={styles.panel}>
          <h2 style={styles.panelTitle}>Informations</h2>
          
          <div style={styles.infoBox}>
            <span style={styles.label}>Trait au joueur :</span>
            <span style={{
              ...styles.turnIndicator, 
              backgroundColor: turn === 'w' ? '#ffffff' : '#444444',
              color: turn === 'w' ? '#111111' : '#ffffff',
              border: turn === 'w' ? '2px solid #ffffff' : '2px solid #555555'
            }}>
              {turn === 'w' ? 'Blancs (Toi)' : 'Noirs (Robot)'}
            </span>
          </div>

          {statusMessage && (
            <div style={{
              ...styles.statusBox,
              backgroundColor: isGameOver ? '#1b4332' : '#7f5539',
              color: isGameOver ? '#b7e4c7' : '#ede0d4',
              borderColor: isGameOver ? '#2d6a4f' : '#9c6644',
            }}>
              {statusMessage}
            </div>
          )}

          <button onClick={handleRestart} style={styles.button}>
            🔄 Recommencer la partie
          </button>
        </aside>
      </main>
    </div>
  );
}

// --- DESIGN SOMBRE ---
const styles: Record<string, React.CSSProperties> = {
  container: {
    fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    backgroundColor: '#121212', 
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: '#ffffff', 
  },
  header: { margin: '20px 0' },
  title: { fontSize: '2.5rem', fontWeight: '700', color: '#ffffff' },
  gameLayout: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: '40px',
    padding: '20px',
    maxWidth: '1000px',
    width: '100%',
  },
  boardContainer: {
    backgroundColor: '#1e1e1e', 
    padding: '15px',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
  },
  board: { width: '450px', maxWidth: '90vw' },
  panel: {
    flex: '1',
    minWidth: '280px',
    backgroundColor: '#1e1e1e', 
    color: '#ffffff', 
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  panelTitle: {
    margin: '0 0 10px 0',
    borderBottom: '2px solid #333333',
    paddingBottom: '10px',
    fontSize: '1.5rem',
    color: '#ffffff', 
  },
  infoBox: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.1rem' },
  label: { fontWeight: '600' },
  turnIndicator: {
    padding: '8px 14px',
    borderRadius: '999px',
    fontWeight: 700,
    fontSize: '0.95rem',
    backgroundColor: '#ffffff',
    color: '#111111',
  },
  statusBox: {
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1px solid transparent',
    fontWeight: 600,
  },
  button: {
    padding: '12px 18px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: '#2d6a4f',
    color: '#ffffff',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '1rem',
  },
};
