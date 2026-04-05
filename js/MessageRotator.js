import { MESSAGES, MESSAGE_INTERVAL, TOTAL_TRANSITION } from './constants.js';

export class MessageRotator {
  constructor(board) {
    this.board = board;
    this.messages = [...MESSAGES];
    this.currentIndex = -1;
    this._timer = null;
    this._paused = false;
    this._intervalMs = MESSAGE_INTERVAL + TOTAL_TRANSITION;
  }

  start() {
    this.next();
    this._startTimer();
  }

  stop() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  }

  pause() {
    this._paused = true;
  }

  resume() {
    this._paused = false;
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.messages.length;
    this.board.displayMessage(this.messages[this.currentIndex]);
    this._resetAutoRotation();
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.messages.length) % this.messages.length;
    this.board.displayMessage(this.messages[this.currentIndex]);
    this._resetAutoRotation();
  }

  showIndex(index) {
    if (index < 0 || index >= this.messages.length) return;
    this.currentIndex = index;
    this.board.displayMessage(this.messages[this.currentIndex]);
    this._resetAutoRotation();
  }

  setMessages(newMessages) {
    this.messages = newMessages;
    // Clamp index
    if (this.currentIndex >= this.messages.length) {
      this.currentIndex = 0;
    }
    // Show current immediately
    if (this.messages.length > 0) {
      this.board.displayMessage(this.messages[this.currentIndex] || []);
    }
  }

  setInterval(ms) {
    this._intervalMs = ms;
    this._resetAutoRotation();
  }

  _startTimer() {
    this._timer = setInterval(() => {
      if (!this._paused && !this.board.isTransitioning) {
        this.next();
      }
    }, this._intervalMs);
  }

  _resetAutoRotation() {
    if (this._timer) {
      clearInterval(this._timer);
      this._startTimer();
    }
  }
}
