import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  RotateCcw, 
  Hand as HandIcon, 
  Cpu, 
  Info,
  ChevronRight,
  Home,
  Languages,
  Globe
} from 'lucide-react';
import { Suit, Rank, Card, GameStatus, PlayerType } from './types';
import { 
  createDeck, 
  SUIT_SYMBOLS, 
  SUIT_COLORS, 
  SUITS 
} from './constants';

// --- Types & Constants ---

enum Language {
  MANDARIN = 'zh-CN',
  CANTONESE = 'zh-HK',
  ENGLISH = 'en-GB',
  JAPANESE = 'ja-JP',
  RUSSIAN = 'ru-RU',
  FRENCH = 'fr-FR',
  GERMAN = 'de-DE',
  KOREAN = 'ko-KR'
}

const TRANSLATIONS: Record<Language, any> = {
  [Language.MANDARIN]: {
    welcome: "欢迎来到 Feier 疯狂 8 点！",
    playerTurn: "轮到你了！请匹配花色或点数。",
    wild8: "疯狂 8 点！请选择一个新的花色。",
    aiWild8: (suit: string) => `AI 打出了 8 并选择了 ${suit}！`,
    emptyDeck: "摸牌堆已空！跳过回合。",
    playerDraw: "你摸了一张牌。",
    aiDraw: "AI 摸了一张牌。",
    suitChosen: (suit: string) => `你选择了 ${suit}。轮到 AI 了。`,
    title: "疯狂 8 点",
    subtitle: "—— 经典的策略与运气卡牌游戏 ——",
    howToPlay: "玩法介绍",
    howToPlayDesc: "匹配弃牌堆顶牌的花色或点数。最先清空手牌的人获胜！",
    wild8Title: "万能 8 点",
    wild8Desc: "8 点是万能牌！随时打出它来改变当前的花色。",
    startGame: "开始游戏",
    backToHome: "返回主页",
    newGame: "新游戏",
    aiOpponent: "AI 对手",
    drawPile: "摸牌堆",
    discardPile: "弃牌堆",
    yourHand: "你的手牌",
    youWin: "你赢了！",
    aiWin: "AI 赢了！",
    winDesc: "太棒了！你已经掌握了疯狂 8 点的精髓。",
    lossDesc: "AI 棋高一着。下次再接再厉！",
    playAgain: "再玩一次",
    chooseSuitDesc: "请选择一个新的花色继续游戏。",
    langName: "普通话"
  },
  [Language.CANTONESE]: {
    welcome: "欢迎嚟到 Feier 疯狂 8 点！",
    playerTurn: "到你喇！请匹配花色或者点数。",
    wild8: "疯狂 8 点！请拣个新花色。",
    aiWild8: (suit: string) => `AI 出咗 8 并拣咗 ${suit}！`,
    emptyDeck: "摸牌堆空咗！跳过呢个回合。",
    playerDraw: "你摸咗一张牌。",
    aiDraw: "AI 摸咗一张牌。",
    suitChosen: (suit: string) => `你拣咗 ${suit}。到 AI 喇。`,
    title: "疯狂 8 点",
    subtitle: "—— 经典嘅策略同运气卡牌游戏 ——",
    howToPlay: "玩法介绍",
    howToPlayDesc: "匹配弃牌堆顶牌嘅花色或者点数。最快清空手牌嘅人赢！",
    wild8Title: "万能 8 点",
    wild8Desc: "8 点系万能牌！随时出佢嚟改变当前嘅花色。",
    startGame: "开始游戏",
    backToHome: "返回主页",
    newGame: "新游戏",
    aiOpponent: "AI 对手",
    drawPile: "摸牌堆",
    discardPile: "弃牌堆",
    yourHand: "你嘅手牌",
    youWin: "你赢咗！",
    aiWin: "AI 赢咗！",
    winDesc: "好嘢！你已经掌握咗疯狂 8 点嘅精髓。",
    lossDesc: "AI 劲啲喎。下次再努力！",
    playAgain: "再玩一次",
    chooseSuitDesc: "请拣个新花色继续游戏。",
    langName: "粤语"
  },
  [Language.ENGLISH]: {
    welcome: "Welcome to Feier Crazy 8s!",
    playerTurn: "Your turn! Match the suit or rank.",
    wild8: "Crazy 8! Choose a new suit.",
    aiWild8: (suit: string) => `AI played an 8 and chose ${suit}!`,
    emptyDeck: "Deck is empty! Skipping turn.",
    playerDraw: "You drew a card.",
    aiDraw: "AI drew a card.",
    suitChosen: (suit: string) => `You chose ${suit}. AI's turn.`,
    title: "Crazy 8s",
    subtitle: "-- Classic Strategy & Luck Card Game --",
    howToPlay: "How to Play",
    howToPlayDesc: "Match the suit or rank of the top card. First to empty their hand wins!",
    wild8Title: "Wild 8s",
    wild8Desc: "8s are wild! Play them anytime to change the current suit.",
    startGame: "Start Game",
    backToHome: "Home",
    newGame: "New Game",
    aiOpponent: "AI Opponent",
    drawPile: "Draw Pile",
    discardPile: "Discard Pile",
    yourHand: "Your Hand",
    youWin: "You Win!",
    aiWin: "AI Wins!",
    winDesc: "Great job! You've mastered Crazy 8s.",
    lossDesc: "AI was smarter this time. Try again!",
    playAgain: "Play Again",
    chooseSuitDesc: "Select a new suit to continue.",
    langName: "English"
  },
  [Language.JAPANESE]: {
    welcome: "Feier クレイジー8へようこそ！",
    playerTurn: "あなたの番です！マークまたは数字を合わせてください。",
    wild8: "クレイジー8！新しいマークを選んでください。",
    aiWild8: (suit: string) => `AIが8を出し、${suit}を選びました！`,
    emptyDeck: "山札が空です！ターンをスキップします。",
    playerDraw: "カードを1枚引きました。",
    aiDraw: "AIがカードを1枚引きました。",
    suitChosen: (suit: string) => `${suit}を選びました。AIの番です。`,
    title: "クレイジー8",
    subtitle: "—— 定番の戦略と運のカードゲーム ——",
    howToPlay: "遊び方",
    howToPlayDesc: "場のカードと同じマークか数字を出します。手札を早くなくした人の勝ちです！",
    wild8Title: "万能の8",
    wild8Desc: "8は万能カードです！いつでも出してマークを変えることができます。",
    startGame: "ゲーム開始",
    backToHome: "ホームへ",
    newGame: "ニューゲーム",
    aiOpponent: "AI対戦相手",
    drawPile: "山札",
    discardPile: "捨て札",
    yourHand: "あなたの手札",
    youWin: "あなたの勝ち！",
    aiWin: "AIの勝ち！",
    winDesc: "お見事！クレイジー8をマスターしましたね。",
    lossDesc: "AIの方が一枚上手でした。次は頑張りましょう！",
    playAgain: "もう一度遊ぶ",
    chooseSuitDesc: "新しいマークを選んで続けてください。",
    langName: "日本語"
  },
  [Language.RUSSIAN]: {
    welcome: "Добро пожаловать в Feier Crazy 8s!",
    playerTurn: "Ваш ход! Совпадение по масти или достоинству.",
    wild8: "Безумная восьмерка! Выберите новую масть.",
    aiWild8: (suit: string) => `ИИ сыграл 8 и выбрал ${suit}!`,
    emptyDeck: "Колода пуста! Пропуск хода.",
    playerDraw: "Вы взяли карту.",
    aiDraw: "ИИ взял карту.",
    suitChosen: (suit: string) => `Вы выбрали ${suit}. Ход ИИ.`,
    title: "Crazy 8s",
    subtitle: "-- Классическая карточная игра стратегии и удачи --",
    howToPlay: "Как играть",
    howToPlayDesc: "Совместите масть или достоинство верхней карты. Побеждает тот, кто первым очистит руку!",
    wild8Title: "Дикие восьмерки",
    wild8Desc: "Восьмерки — дикие карты! Играйте их в любое время, чтобы сменить масть.",
    startGame: "Начать игру",
    backToHome: "Домой",
    newGame: "Новая игра",
    aiOpponent: "ИИ Противник",
    drawPile: "Колода",
    discardPile: "Сброс",
    yourHand: "Ваша рука",
    youWin: "Вы победили!",
    aiWin: "ИИ победил!",
    winDesc: "Отличная работа! Вы освоили Crazy 8s.",
    lossDesc: "ИИ был умнее на этот раз. Попробуйте еще раз!",
    playAgain: "Играть снова",
    chooseSuitDesc: "Выберите новую масть, чтобы продолжить.",
    langName: "Русский"
  },
  [Language.FRENCH]: {
    welcome: "Bienvenue dans Feier Crazy 8s !",
    playerTurn: "À vous de jouer ! Faites correspondre la couleur ou le rang.",
    wild8: "Crazy 8 ! Choisissez une nouvelle couleur.",
    aiWild8: (suit: string) => `L'IA a joué un 8 et a choisi ${suit} !`,
    emptyDeck: "La pioche est vide ! Tour passé.",
    playerDraw: "Vous avez pioché une carte.",
    aiDraw: "L'IA a pioché une carte.",
    suitChosen: (suit: string) => `Vous avez choisi ${suit}. Au tour de l'IA.`,
    title: "Crazy 8s",
    subtitle: "-- Jeu de cartes classique de stratégie et de chance --",
    howToPlay: "Comment jouer",
    howToPlayDesc: "Faites correspondre la couleur ou le rang de la carte du dessus. Le premier à vider sa main gagne !",
    wild8Title: "8 Sauvages",
    wild8Desc: "Les 8 sont sauvages ! Jouez-les n'importe quand pour changer la couleur.",
    startGame: "Démarrer",
    backToHome: "Accueil",
    newGame: "Nouveau jeu",
    aiOpponent: "Adversaire IA",
    drawPile: "Pioche",
    discardPile: "Défausse",
    yourHand: "Votre main",
    youWin: "Vous avez gagné !",
    aiWin: "L'IA a gagné !",
    winDesc: "Beau travail ! Vous maîtrisez le Crazy 8s.",
    lossDesc: "L'IA était plus maline cette fois. Réessayez !",
    playAgain: "Rejouer",
    chooseSuitDesc: "Sélectionnez une nouvelle couleur pour continuer.",
    langName: "Français"
  },
  [Language.GERMAN]: {
    welcome: "Willkommen bei Feier Crazy 8s!",
    playerTurn: "Du bist dran! Farbe oder Wert bedienen.",
    wild8: "Crazy 8! Wähle eine neue Farbe.",
    aiWild8: (suit: string) => `KI hat eine 8 gespielt und ${suit} gewählt!`,
    emptyDeck: "Nachziehstapel ist leer! Runde aussetzen.",
    playerDraw: "Du hast eine Karte gezogen.",
    aiDraw: "KI hat eine Karte gezogen.",
    suitChosen: (suit: string) => `Du hast ${suit} gewählt. KI ist dran.`,
    title: "Crazy 8s",
    subtitle: "-- Klassisches Strategie- und Glückskartenspiel --",
    howToPlay: "Spielanleitung",
    howToPlayDesc: "Bedienen Sie Farbe oder Wert der obersten Karte. Wer zuerst seine Hand leert, gewinnt!",
    wild8Title: "Wilde Achten",
    wild8Desc: "Achten sind Joker! Spielen Sie sie jederzeit, um die aktuelle Farbe zu ändern.",
    startGame: "Spiel starten",
    backToHome: "Home",
    newGame: "Neues Spiel",
    aiOpponent: "KI-Gegner",
    drawPile: "Nachziehstapel",
    discardPile: "Ablagestapel",
    yourHand: "Deine Hand",
    youWin: "Du hast gewonnen!",
    aiWin: "KI hat gewonnen!",
    winDesc: "Gute Arbeit! Du hast Crazy 8s gemeistert.",
    lossDesc: "Die KI war diesmal schlauer. Versuch es noch einmal!",
    playAgain: "Noch einmal spielen",
    chooseSuitDesc: "Wähle eine neue Farbe, um fortzufahren.",
    langName: "Deutsch"
  },
  [Language.KOREAN]: {
    welcome: "Feier 크레이지 8에 오신 것을 환영합니다!",
    playerTurn: "당신의 차례입니다! 문양이나 숫자를 맞추세요.",
    wild8: "크레이지 8! 새로운 문양을 선택하세요.",
    aiWild8: (suit: string) => `AI가 8을 내고 ${suit}를 선택했습니다!`,
    emptyDeck: "카드 더미가 비었습니다! 차례를 건너뜁니다.",
    playerDraw: "카드를 한 장 뽑았습니다.",
    aiDraw: "AI가 카드를 한 장 뽑았습니다.",
    suitChosen: (suit: string) => `${suit}를 선택했습니다. AI 차례입니다.`,
    title: "크레이지 8",
    subtitle: "-- 클래식 전략 및 운 카드 게임 --",
    howToPlay: "게임 방법",
    howToPlayDesc: "맨 위의 카드와 문양이나 숫자를 맞추세요. 먼저 손을 비우는 사람이 승리합니다!",
    wild8Title: "와일드 8",
    wild8Desc: "8은 와일드 카드입니다! 언제든지 내서 문양을 바꿀 수 있습니다.",
    startGame: "게임 시작",
    backToHome: "홈으로",
    newGame: "새 게임",
    aiOpponent: "AI 상대",
    drawPile: "카드 더미",
    discardPile: "버리는 더미",
    yourHand: "내 손패",
    youWin: "당신의 승리!",
    aiWin: "AI 승리!",
    winDesc: "잘했습니다! 크레이지 8을 마스터하셨군요.",
    lossDesc: "이번에는 AI가 더 똑똑했습니다. 다시 시도해보세요!",
    playAgain: "다시 하기",
    chooseSuitDesc: "계속하려면 새로운 문양을 선택하세요.",
    langName: "한국어"
  }
};

// --- Components ---

const PlayingCard = ({ 
  card, 
  isFaceUp = true, 
  onClick, 
  isPlayable = false,
  className = "" 
}: { 
  card: Card | null; 
  isFaceUp?: boolean; 
  onClick?: () => void;
  isPlayable?: boolean;
  className?: string;
  key?: React.Key;
}) => {
  if (!card) return null;

  return (
    <motion.div
      layoutId={card.id}
      whileHover={isPlayable ? { y: -20, scale: 1.05 } : {}}
      whileTap={isPlayable ? { scale: 0.95 } : {}}
      onClick={onClick}
      className={`
        relative w-20 h-28 sm:w-24 sm:h-36 rounded-lg shadow-xl cursor-pointer
        flex flex-col items-center justify-center border-2 transition-colors
        ${isFaceUp ? 'bg-white' : 'bg-blue-800 border-blue-400'}
        ${isPlayable ? 'border-yellow-400 ring-4 ring-yellow-400/30' : 'border-neutral-200'}
        ${className}
      `}
    >
      {isFaceUp ? (
        <>
          <div className={`absolute top-1 left-2 text-lg font-bold ${SUIT_COLORS[card.suit]}`}>
            {card.rank}
          </div>
          <div className={`text-4xl ${SUIT_COLORS[card.suit]}`}>
            {SUIT_SYMBOLS[card.suit]}
          </div>
          <div className={`absolute bottom-1 right-2 text-lg font-bold rotate-180 ${SUIT_COLORS[card.suit]}`}>
            {card.rank}
          </div>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center p-2">
          <div className="w-full h-full border-2 border-blue-300 rounded-md opacity-20 flex items-center justify-center">
             <HandIcon className="text-white opacity-50" size={32} />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default function App() {
  const [language, setLanguage] = useState<Language>(Language.MANDARIN);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showChinaSubMenu, setShowChinaSubMenu] = useState(false);

  const t = TRANSLATIONS[language];

  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [aiHand, setAiHand] = useState<Card[]>([]);
  const [discardPile, setDiscardPile] = useState<Card[]>([]);
  const [currentTurn, setCurrentTurn] = useState<PlayerType>(PlayerType.PLAYER);
  const [gameStatus, setGameStatus] = useState<GameStatus>(Language.MANDARIN === 'zh-CN' ? GameStatus.IDLE : GameStatus.IDLE); // Fix for initial state
  const [activeSuit, setActiveSuit] = useState<Suit | null>(null);
  const [winner, setWinner] = useState<PlayerType | null>(null);
  const [message, setMessage] = useState<string>(TRANSLATIONS[Language.MANDARIN].welcome);

  // Initialize Game
  const startGame = () => {
    const newDeck = createDeck();
    const pHand = newDeck.splice(0, 8);
    const aHand = newDeck.splice(0, 8);
    
    // Find first non-8 card for discard pile
    let firstDiscardIndex = 0;
    while (newDeck[firstDiscardIndex] && newDeck[firstDiscardIndex].rank === Rank.EIGHT) {
      firstDiscardIndex++;
    }
    
    if (!newDeck[firstDiscardIndex]) {
      // Fallback if somehow all cards are 8s (impossible with 52 cards)
      firstDiscardIndex = 0;
    }

    const firstDiscard = newDeck.splice(firstDiscardIndex, 1)[0];

    setDeck(newDeck);
    setPlayerHand(pHand);
    setAiHand(aHand);
    setDiscardPile([firstDiscard]);
    setActiveSuit(firstDiscard.suit);
    setCurrentTurn(PlayerType.PLAYER);
    setGameStatus(GameStatus.PLAYING);
    setWinner(null);
    setMessage(t.playerTurn);
  };

  const topCard = discardPile[discardPile.length - 1];

  const isCardPlayable = (card: Card) => {
    if (!topCard) return false;
    if (card.rank === Rank.EIGHT) return true;
    if (activeSuit && card.suit === activeSuit) return true;
    if (card.rank === topCard.rank) return true;
    return false;
  };

  const playCard = (card: Card, player: PlayerType) => {
    if (gameStatus !== GameStatus.PLAYING && gameStatus !== GameStatus.CHOOSING_SUIT) return;
    
    // Move card to discard pile
    setDiscardPile(prev => [...prev, card]);
    
    if (player === PlayerType.PLAYER) {
      setPlayerHand(prev => prev.filter(c => c.id !== card.id));
    } else {
      setAiHand(prev => prev.filter(c => c.id !== card.id));
    }

    if (card.rank === Rank.EIGHT) {
      if (player === PlayerType.PLAYER) {
        setGameStatus(GameStatus.CHOOSING_SUIT);
        setMessage(t.wild8);
      } else {
        // AI chooses a suit (most frequent suit in its hand)
        const suitCounts = aiHand.reduce((acc, c) => {
          acc[c.suit] = (acc[c.suit] || 0) + 1;
          return acc;
        }, {} as Record<Suit, number>);
        const bestSuit = (Object.keys(suitCounts) as Suit[]).sort((a, b) => suitCounts[b] - suitCounts[a])[0] || Suit.HEARTS;
        setActiveSuit(bestSuit);
        setMessage(t.aiWild8(bestSuit));
        endTurn();
      }
    } else {
      setActiveSuit(card.suit);
      endTurn();
    }
  };

  const endTurn = () => {
    setCurrentTurn(prev => prev === PlayerType.PLAYER ? PlayerType.AI : PlayerType.PLAYER);
  };

  const drawCard = (player: PlayerType) => {
    if (deck.length === 0) {
      setMessage(t.emptyDeck);
      endTurn();
      return;
    }

    const newDeck = [...deck];
    const drawnCard = newDeck.pop()!;
    setDeck(newDeck);

    if (player === PlayerType.PLAYER) {
      setPlayerHand(prev => [...prev, drawnCard]);
      setMessage(t.playerDraw);
      // Check if drawn card is playable immediately? 
      // In some rules you can, in some you can't. Let's allow it if it's playable.
      if (!isCardPlayable(drawnCard)) {
        endTurn();
      }
    } else {
      setAiHand(prev => [...prev, drawnCard]);
      setMessage(t.aiDraw);
      if (!isCardPlayable(drawnCard)) {
        endTurn();
      }
    }
  };

  // Check for winner
  useEffect(() => {
    if (gameStatus === GameStatus.PLAYING) {
      if (playerHand.length === 0) {
        setWinner(PlayerType.PLAYER);
        setGameStatus(GameStatus.GAME_OVER);
      } else if (aiHand.length === 0) {
        setWinner(PlayerType.AI);
        setGameStatus(GameStatus.GAME_OVER);
      }
    }
  }, [playerHand, aiHand, gameStatus]);

  // AI Turn Logic
  useEffect(() => {
    if (currentTurn === PlayerType.AI && gameStatus === GameStatus.PLAYING) {
      const timer = setTimeout(() => {
        const playableCards = aiHand.filter(isCardPlayable);
        if (playableCards.length > 0) {
          // AI Strategy: Play non-8s first if possible
          const nonEights = playableCards.filter(c => c.rank !== Rank.EIGHT);
          const cardToPlay = nonEights.length > 0 
            ? nonEights[Math.floor(Math.random() * nonEights.length)] 
            : playableCards[0];
          playCard(cardToPlay, PlayerType.AI);
        } else {
          drawCard(PlayerType.AI);
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentTurn, aiHand, gameStatus, activeSuit, topCard]);

  const handleSuitSelection = (suit: Suit) => {
    setActiveSuit(suit);
    setGameStatus(GameStatus.PLAYING);
    setMessage(t.suitChosen(suit));
    endTurn();
  };

  return (
    <div className="min-h-screen font-sans overflow-hidden">
      <AnimatePresence mode="wait">
        {gameStatus === GameStatus.IDLE ? (
          /* --- 主页 (Home Page) --- */
          <motion.div 
            key="home-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-br from-[#d32f2f] to-[#8e0000] z-[60] flex flex-col items-center justify-center p-8 text-center relative overflow-hidden"
          >
            {/* Decorative background patterns */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/60-lines.png")' }} />
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.15)_0%,transparent_70%)]" />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl relative z-10 p-12 rounded-[4rem] border-8 border-amber-400/20 bg-black/10 backdrop-blur-sm"
            >
              <div className="flex justify-center gap-4 mb-10">
                {SUITS.map((s, i) => (
                  <motion.div
                    key={s}
                    initial={{ rotate: -20 + i * 10, y: 20 }}
                    animate={{ rotate: -10 + i * 5, y: 0 }}
                    className={`text-7xl drop-shadow-[0_0_20px_rgba(255,215,0,0.6)] ${SUIT_COLORS[s] === 'text-black' ? 'text-amber-400' : 'text-white'}`}
                  >
                    {SUIT_SYMBOLS[s]}
                  </motion.div>
                ))}
              </div>
              
              <h1 className="text-8xl font-black mb-8 tracking-tighter leading-none text-white">
                FEIER<br/><span className="text-amber-400 drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]">{t.title}</span>
              </h1>
              
              <p className="text-amber-100/90 text-2xl mb-12 font-medium italic">
                {t.subtitle}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left mb-14">
                <div className="bg-amber-400/20 p-6 rounded-3xl border-2 border-amber-400/40 backdrop-blur-md">
                  <div className="flex items-center gap-3 mb-3 text-amber-300">
                    <Info size={24} />
                    <span className="font-bold uppercase text-sm tracking-widest">{t.howToPlay}</span>
                  </div>
                  <p className="text-base text-amber-50 leading-relaxed">{t.howToPlayDesc}</p>
                </div>
                <div className="bg-amber-400/20 p-6 rounded-3xl border-2 border-amber-400/40 backdrop-blur-md">
                  <div className="flex items-center gap-3 mb-3 text-amber-300">
                    <RotateCcw size={24} />
                    <span className="font-bold uppercase text-sm tracking-widest">{t.wild8Title}</span>
                  </div>
                  <p className="text-base text-amber-50 leading-relaxed">{t.wild8Desc}</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={startGame}
                  className="group relative bg-gradient-to-b from-amber-300 to-amber-600 text-red-950 font-black py-8 px-20 rounded-full hover:scale-105 active:scale-95 transition-all flex items-center gap-6 text-3xl shadow-[0_0_50px_rgba(255,193,7,0.5)] border-4 border-amber-200"
                >
                  {t.startGame}
                  <ChevronRight size={32} className="group-hover:translate-x-2 transition-transform" />
                </button>

                <div className="relative">
                  <button
                    onClick={() => {
                      setShowLangMenu(!showLangMenu);
                      setShowChinaSubMenu(false);
                    }}
                    className="bg-black/40 hover:bg-black/60 text-white p-6 rounded-full border-4 border-amber-400/20 transition-all shadow-xl flex items-center justify-center"
                  >
                    <Globe size={32} />
                  </button>

                  <AnimatePresence>
                    {showLangMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="absolute bottom-full right-0 mb-4 bg-neutral-900/95 backdrop-blur-xl border-2 border-amber-400/30 rounded-3xl p-4 shadow-2xl min-w-[240px] z-50 overflow-hidden"
                      >
                        <div className="grid grid-cols-1 gap-2">
                          {[
                            { lang: Language.MANDARIN, flag: '🇨🇳', label: '中国' },
                            { lang: Language.ENGLISH, flag: '🇬🇧', label: 'UK' },
                            { lang: Language.JAPANESE, flag: '🇯🇵', label: '日本' },
                            { lang: Language.RUSSIAN, flag: '🇷🇺', label: 'Россия' },
                            { lang: Language.FRENCH, flag: '🇫🇷', label: 'France' },
                            { lang: Language.GERMAN, flag: '🇩🇪', label: 'Deutschland' },
                            { lang: Language.KOREAN, flag: '🇰🇷', label: '한국' }
                          ].map((item) => (
                            <button
                              key={item.lang}
                              onClick={() => {
                                if (item.lang === Language.MANDARIN) {
                                  setShowChinaSubMenu(true);
                                } else {
                                  setLanguage(item.lang);
                                  setShowLangMenu(false);
                                }
                              }}
                              className="flex items-center gap-4 p-3 rounded-xl hover:bg-amber-400/20 transition-colors text-left group"
                            >
                              <span className="text-3xl group-hover:scale-110 transition-transform">{item.flag}</span>
                              <span className="font-bold text-amber-50">{item.label}</span>
                            </button>
                          ))}
                        </div>

                        <AnimatePresence>
                          {showChinaSubMenu && (
                            <motion.div
                              initial={{ x: '100%' }}
                              animate={{ x: 0 }}
                              exit={{ x: '100%' }}
                              className="absolute inset-0 bg-neutral-900 z-10 p-4 flex flex-col gap-2"
                            >
                              <button 
                                onClick={() => setShowChinaSubMenu(false)}
                                className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2"
                              >
                                <ChevronRight size={14} className="rotate-180" /> 返回
                              </button>
                              <button
                                onClick={() => {
                                  setLanguage(Language.MANDARIN);
                                  setShowLangMenu(false);
                                  setShowChinaSubMenu(false);
                                }}
                                className="flex items-center gap-4 p-4 rounded-xl hover:bg-amber-400/20 transition-colors text-left"
                              >
                                <span className="text-3xl">🇨🇳</span>
                                <span className="font-bold text-amber-50">普通话</span>
                              </button>
                              <button
                                onClick={() => {
                                  setLanguage(Language.CANTONESE);
                                  setShowLangMenu(false);
                                  setShowChinaSubMenu(false);
                                }}
                                className="flex items-center gap-4 p-4 rounded-xl hover:bg-amber-400/20 transition-colors text-left"
                              >
                                <span className="text-3xl">🇭🇰</span>
                                <span className="font-bold text-amber-50">粤语</span>
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          /* --- 游戏桌 (Game Table) --- */
          <motion.div 
            key="game-table"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen felt-table flex flex-col items-center justify-between p-4 relative overflow-hidden"
          >
            {/* Header / Info */}
            <div className="w-full max-w-4xl flex justify-between items-center z-10">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setGameStatus(GameStatus.IDLE)}
                  className="flex items-center gap-2 bg-black/40 hover:bg-black/60 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 transition-all text-white shadow-lg group"
                  title="返回主页"
                >
                  <Home size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold uppercase tracking-wider">{t.backToHome}</span>
                </button>
                <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
                  <HandIcon className="text-amber-400" size={20} />
                  <span className="text-sm font-medium">Feier {t.title}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={startGame}
                  className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-4 py-2 rounded-full transition-all border border-amber-300 shadow-lg shadow-amber-500/20"
                >
                  <RotateCcw size={18} />
                  <span className="hidden sm:inline">{t.newGame}</span>
                </button>
              </div>
            </div>

            {/* AI Hand */}
            <div className="w-full flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-neutral-400 mb-2">
                <Cpu size={16} />
                <span className="text-xs uppercase tracking-widest font-bold">{t.aiOpponent} ({aiHand.length})</span>
              </div>
              <div className="flex -space-x-12 sm:-space-x-16 hover:-space-x-8 transition-all duration-300">
                {aiHand.map((card, i) => (
                  <PlayingCard 
                    key={card.id} 
                    card={card} 
                    isFaceUp={false} 
                    className="scale-90 opacity-80"
                  />
                ))}
              </div>
            </div>

            {/* Center Area: Deck & Discard */}
            <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-16 my-8">
              {/* Draw Pile */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  {deck.length > 0 && (
                    <div className="absolute -top-1 -left-1 w-20 h-28 sm:w-24 sm:h-36 bg-blue-900 rounded-lg border-2 border-blue-400 shadow-lg" />
                  )}
                  <PlayingCard 
                    card={{ id: 'deck', suit: Suit.SPADES, rank: Rank.ACE }} 
                    isFaceUp={false} 
                    onClick={() => currentTurn === PlayerType.PLAYER && gameStatus === GameStatus.PLAYING && drawCard(PlayerType.PLAYER)}
                    className={currentTurn === PlayerType.PLAYER && gameStatus === GameStatus.PLAYING ? "hover:ring-4 hover:ring-blue-400/50" : ""}
                  />
                  <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                    {deck.length}
                  </div>
                </div>
                <span className="text-[10px] uppercase tracking-tighter text-white/50 font-bold">{t.drawPile}</span>
              </div>

              {/* Discard Pile */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative min-h-[112px] sm:min-h-[144px] min-w-[80px] sm:min-w-[96px]">
                   <AnimatePresence mode="popLayout">
                      {topCard && (
                        <PlayingCard 
                          key={topCard.id}
                          card={topCard} 
                          isFaceUp={true} 
                          className="shadow-2xl"
                        />
                      )}
                   </AnimatePresence>
                   {activeSuit && topCard && (
                     <div className={`absolute -top-4 -right-4 w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center text-2xl border-2 border-neutral-100 ${SUIT_COLORS[activeSuit]}`}>
                       {SUIT_SYMBOLS[activeSuit]}
                     </div>
                   )}
                </div>
                <span className="text-[10px] uppercase tracking-tighter text-white/50 font-bold">{t.discardPile}</span>
              </div>
            </div>

            {/* Player Hand */}
            <div className="w-full flex flex-col items-center gap-4 max-w-5xl">
              <div className="flex items-center gap-2 text-neutral-400">
                <HandIcon size={16} />
                <span className="text-xs uppercase tracking-widest font-bold">{t.yourHand} ({playerHand.length})</span>
              </div>
              
              <div className="w-full overflow-x-auto no-scrollbar pb-8 px-4">
                <div className="flex justify-center -space-x-8 sm:-space-x-12 min-w-max">
                  {playerHand.map((card) => {
                    const playable = currentTurn === PlayerType.PLAYER && isCardPlayable(card) && gameStatus === GameStatus.PLAYING;
                    return (
                      <PlayingCard 
                        key={card.id} 
                        card={card} 
                        isPlayable={playable}
                        onClick={() => playable && playCard(card, PlayerType.PLAYER)}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Status Message */}
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10 shadow-2xl z-20 flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full animate-pulse ${currentTurn === PlayerType.PLAYER ? 'bg-green-400' : 'bg-blue-400'}`} />
              <p className="text-sm font-medium text-white/90 whitespace-nowrap">
                {message}
              </p>
            </div>

            {/* Suit Selector Modal */}
            <AnimatePresence>
              {gameStatus === GameStatus.CHOOSING_SUIT && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                >
                  <motion.div 
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="bg-neutral-900 border border-white/10 p-8 rounded-3xl shadow-2xl max-w-md w-full text-center"
                  >
                    <h2 className="text-2xl font-bold mb-2">{t.title}！</h2>
                    <p className="text-neutral-400 mb-8">{t.chooseSuitDesc}</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {SUITS.map((suit) => (
                        <button
                          key={suit}
                          onClick={() => handleSuitSelection(suit)}
                          className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group"
                        >
                          <span className={`text-5xl mb-2 group-hover:scale-110 transition-transform ${SUIT_COLORS[suit]}`}>
                            {SUIT_SYMBOLS[suit]}
                          </span>
                          <span className="text-xs font-bold uppercase tracking-widest opacity-50">{suit}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Game Over Modal */}
            <AnimatePresence>
              {gameStatus === GameStatus.GAME_OVER && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
                >
                  <motion.div 
                    initial={{ scale: 0.8, y: 40 }}
                    animate={{ scale: 1, y: 0 }}
                    className="bg-neutral-900 border border-white/10 p-12 rounded-[3rem] shadow-2xl max-w-lg w-full text-center relative overflow-hidden"
                  >
                    {/* Decorative background */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
                    
                    <div className="mb-8 flex justify-center">
                      <div className="w-24 h-24 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                        <Trophy size={48} />
                      </div>
                    </div>
                    
                    <h2 className="text-5xl font-black mb-4 tracking-tighter">
                      {winner === PlayerType.PLAYER ? t.youWin : t.aiWin}
                    </h2>
                    <p className="text-neutral-400 text-lg mb-12">
                      {winner === PlayerType.PLAYER 
                        ? t.winDesc 
                        : t.lossDesc}
                    </p>
                    
                    <button
                      onClick={startGame}
                      className="w-full bg-white text-black font-bold py-5 rounded-2xl hover:bg-neutral-200 transition-colors flex items-center justify-center gap-3 text-lg"
                    >
                      <RotateCcw size={20} />
                      {t.playAgain}
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
