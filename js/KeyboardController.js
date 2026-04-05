export class KeyboardController {
  constructor(rotator, soundEngine) {
    this.rotator = rotator;
    this.soundEngine = soundEngine;
    document.addEventListener('keydown', (e) => this._handleKey(e));
  }

  _handleKey(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        this.rotator.next();
        break;
      case 'ArrowRight':
        e.preventDefault();
        this.rotator.next();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        this.rotator.prev();
        break;
      case 'f':
      case 'F':
        e.preventDefault();
        this._toggleFullscreen();
        break;
      case 'm':
      case 'M':
        e.preventDefault();
        if (this.soundEngine) {
          const muted = this.soundEngine.toggleMute();
          this._showToast(muted ? 'SOUND OFF' : 'SOUND ON');
        }
        break;
      case 'Escape':
        if (document.fullscreenElement) document.exitFullscreen();
        break;
    }
  }

  _toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }

  _showToast(msg) {
    if (window._showToast) {
      window._showToast(msg);
    }
  }
}
