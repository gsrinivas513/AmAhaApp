/**
 * AudioFeedback Manager - Handles quiz audio feedback
 * Provides sounds for correct/wrong answers, completion, and other quiz events
 */

class AudioFeedbackManager {
  constructor() {
    this.audioContext = null;
    this.isEnabled = true;
    this.soundUrls = {
      correct: '/sounds/correct-answer.mp3',
      wrong: '/sounds/wrong-answer.mp3',
      completion: '/sounds/completion.mp3',
      notification: '/sounds/notification.mp3',
    };
    this.sounds = {};
    this.initAudioContext();
  }

  /**
   * Initialize Web Audio API context
   */
  initAudioContext() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioContext = new AudioContext();
      }
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  /**
   * Load sound files
   * @param {Object} customUrls - Custom sound URLs
   */
  async loadSounds(customUrls = {}) {
    const urls = { ...this.soundUrls, ...customUrls };

    for (const [key, url] of Object.entries(urls)) {
      try {
        const audio = new Audio();
        audio.src = url;
        audio.preload = 'auto';
        this.sounds[key] = audio;
      } catch (error) {
        console.warn(`Failed to load sound: ${key}`, error);
      }
    }
  }

  /**
   * Initialize audio feedback - loads sounds on first use
   */
  async initialize() {
    if (Object.keys(this.sounds).length === 0) {
      await this.loadSounds();
    }
  }

  /**
   * Play correct answer sound
   */
  playCorrectSound() {
    if (this.isEnabled && this.sounds.correct) {
      this.play(this.sounds.correct);
    }
  }

  /**
   * Play wrong answer sound
   */
  playWrongSound() {
    if (this.isEnabled && this.sounds.wrong) {
      this.play(this.sounds.wrong);
    }
  }

  /**
   * Play quiz completion sound
   */
  playCompletionSound() {
    if (this.isEnabled && this.sounds.completion) {
      this.play(this.sounds.completion);
    }
  }

  /**
   * Play notification sound
   */
  playNotificationSound() {
    if (this.isEnabled && this.sounds.notification) {
      this.play(this.sounds.notification);
    }
  }

  /**
   * Play generic sound with fallback to Web Audio synthesis
   * @param {AudioElement|string} sound - Audio element or sound key
   */
  play(sound) {
    try {
      if (sound instanceof HTMLAudioElement) {
        // Reset playback to start
        sound.currentTime = 0;
        sound.play().catch((error) => {
          console.warn('Failed to play audio:', error);
          this.playTone();
        });
      } else if (typeof sound === 'string') {
        // Use stored sound
        if (this.sounds[sound]) {
          this.play(this.sounds[sound]);
        }
      }
    } catch (error) {
      console.warn('Error playing sound:', error);
      this.playTone();
    }
  }

  /**
   * Generate tone using Web Audio API (fallback)
   * @param {number} frequency - Frequency in Hz (default: 440Hz)
   * @param {number} duration - Duration in ms (default: 100ms)
   */
  playTone(frequency = 440, duration = 100) {
    if (!this.audioContext) return;

    try {
      const now = this.audioContext.currentTime;
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc.connect(gain);
      gain.connect(this.audioContext.destination);

      osc.frequency.value = frequency;
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + duration / 1000);

      osc.start(now);
      osc.stop(now + duration / 1000);
    } catch (error) {
      console.warn('Failed to play tone:', error);
    }
  }

  /**
   * Generate success tone sequence
   */
  playSuccessTone() {
    if (!this.audioContext) return;

    const now = this.audioContext.currentTime;
    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
    const duration = 100;

    frequencies.forEach((freq, index) => {
      const time = now + (index * duration) / 1000;
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc.connect(gain);
      gain.connect(this.audioContext.destination);

      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.2, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + duration / 1000);

      osc.start(time);
      osc.stop(time + duration / 1000);
    });
  }

  /**
   * Generate error tone
   */
  playErrorTone() {
    if (!this.audioContext) return;

    const now = this.audioContext.currentTime;
    const frequencies = [349.23, 293.66]; // F4, D4
    const duration = 150;

    frequencies.forEach((freq, index) => {
      const time = now + (index * duration * 0.5) / 1000;
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc.connect(gain);
      gain.connect(this.audioContext.destination);

      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.2, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + duration / 1000);

      osc.start(time);
      osc.stop(time + duration / 1000);
    });
  }

  /**
   * Toggle audio on/off
   */
  toggle() {
    this.isEnabled = !this.isEnabled;
    return this.isEnabled;
  }

  /**
   * Enable audio
   */
  enable() {
    this.isEnabled = true;
  }

  /**
   * Disable audio
   */
  disable() {
    this.isEnabled = false;
  }

  /**
   * Set volume for all sounds
   * @param {number} volume - Volume from 0 to 1
   */
  setVolume(volume) {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    Object.values(this.sounds).forEach((sound) => {
      if (sound instanceof HTMLAudioElement) {
        sound.volume = clampedVolume;
      }
    });
  }

  /**
   * Stop all sounds
   */
  stopAll() {
    Object.values(this.sounds).forEach((sound) => {
      if (sound instanceof HTMLAudioElement) {
        sound.pause();
        sound.currentTime = 0;
      }
    });
  }
}

// Export singleton instance
export const audioFeedback = new AudioFeedbackManager();

export default AudioFeedbackManager;
