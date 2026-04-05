import { Board } from './Board.js';
import { SoundEngine } from './SoundEngine.js';
import { MessageRotator } from './MessageRotator.js';
import { KeyboardController } from './KeyboardController.js';

document.addEventListener('DOMContentLoaded', () => {
  const boardContainer = document.getElementById('board-container');
  const soundEngine = new SoundEngine();
  const board = new Board(boardContainer, soundEngine);
  const rotator = new MessageRotator(board);
  const keyboard = new KeyboardController(rotator, soundEngine);

  const animDot = document.getElementById('anim-dot');
  const statusText = document.getElementById('status-text');

  // BroadcastChannel: receive commands from control panel
  const channel = new BroadcastChannel('flipoff_control');

  channel.addEventListener('message', (e) => {
    const { type, payload } = e.data;
    switch (type) {
      case 'SET_MESSAGES':
        rotator.setMessages(payload.messages);
        animDot.className = 'dot ctrl';
        statusText.textContent = 'CTRL';
        break;
      case 'SHOW_MESSAGE':
        rotator.showIndex(payload.index);
        break;
      case 'NEXT':
        rotator.next();
        break;
      case 'PREV':
        rotator.prev();
        break;
      case 'SET_INTERVAL':
        rotator.setInterval(payload.ms);
        break;
      case 'SET_AUTOPLAY':
        if (payload.enabled) rotator.resume();
        else rotator.pause();
        break;
      case 'PING':
        channel.postMessage({ type: 'PONG', payload: { index: rotator.currentIndex } });
        animDot.className = 'dot live';
        statusText.textContent = 'LIVE';
        break;
    }
  });

  channel.postMessage({ type: 'DISPLAY_READY' });

  setInterval(() => {
    channel.postMessage({ type: 'STATUS', payload: { index: rotator.currentIndex, transitioning: board.isTransitioning } });
  }, 1000);

  // Audio init
  const startOverlay = document.getElementById('start-overlay');
  let audioInitialized = false;

  const initAudio = async () => {
    if (audioInitialized) return;
    audioInitialized = true;
    await soundEngine.init();
    soundEngine.resume();
    startOverlay.classList.add('hidden');
    setTimeout(() => { startOverlay.style.display = 'none'; }, 600);
    animDot.className = 'dot live';
    statusText.textContent = 'LIVE';
    document.removeEventListener('click', initAudio);
    document.removeEventListener('keydown', initAudio);
  };

  startOverlay.addEventListener('click', initAudio);
  document.addEventListener('keydown', initAudio);

  rotator.start();

  window._showToast = (msg) => {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.style.opacity = '1';
    clearTimeout(toast._t);
    toast._t = setTimeout(() => { toast.style.opacity = '0'; }, 1400);
  };
});
