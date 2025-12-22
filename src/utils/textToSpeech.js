// src/utils/textToSpeech.js
/**
 * Text-to-Speech Utility
 * Provides audio reading functionality for questions and options
 * Perfect for young learners who can't read yet
 */

class TextToSpeechService {
  constructor() {
    this.synth = window.speechSynthesis;
    this.currentUtterance = null;
    this.isPlaying = false;
    this.preferredVoiceIndex = null;
    this.voicesLoaded = false;
    
    // Load voices when available
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => this.selectBestVoice();
    }
    
    // Try to select voice immediately
    setTimeout(() => this.selectBestVoice(), 100);
  }

  /**
   * Select the best voice for kids (clear, female voice)
   * Prioritizes Google voices, then native English US voices
   */
  selectBestVoice() {
    try {
      const voices = this.synth.getVoices();
      if (voices.length === 0) return;
      
      let bestVoice = null;
      let bestScore = -1;

      voices.forEach((voice, index) => {
        // Prioritize English voices
        if (!voice.lang.startsWith('en')) return;
        
        let score = 0;
        
        // Prefer female voices (clearer for kids)
        if (voice.name.includes('Google UK English Female')) score = 1000;
        else if (voice.name.includes('Google US English Female')) score = 950;
        else if (voice.name.includes('Samantha')) score = 900; // macOS
        else if (voice.name.includes('Victoria')) score = 850; // macOS
        else if (voice.name.includes('Moira')) score = 850; // macOS
        else if (voice.name.includes('Karen')) score = 850; // Windows
        else if (voice.name.includes('Zira')) score = 840; // Windows
        else if (voice.name.includes('Female')) score = 100;
        else if (voice.default) score = 50;
        
        if (score > bestScore) {
          bestScore = score;
          bestVoice = voice;
          this.preferredVoiceIndex = index;
        }
      });
      
      console.log('🎤 Selected voice for kids:', bestVoice?.name || 'System default');
      this.voicesLoaded = true;
    } catch (err) {
      console.warn('Could not select voice:', err);
    }
  }

  /**
   * Speak text with customizable options
   * @param {string} text - Text to speak
   * @param {object} options - Configuration options
   */
  speak(text, options = {}) {
    // Cancel any ongoing speech
    this.stop();

    const {
      rate = 0.8, // Slower for kids (0.5 - 2.0) - 0.8 is optimal for 5-12 year olds
      pitch = 1.2, // Slightly higher pitch for kids clarity (0.5 - 2.0)
      volume = 1.0, // Full volume (0 - 1.0)
      language = 'en-US', // Language code
      onStart = null,
      onEnd = null,
      onError = null,
    } = options;

    try {
      // Ensure best voice is selected
      if (!this.voicesLoaded && this.preferredVoiceIndex === null) {
        this.selectBestVoice();
      }
      
      // Create utterance
      this.currentUtterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance.rate = rate;
      this.currentUtterance.pitch = pitch;
      this.currentUtterance.volume = volume;
      this.currentUtterance.lang = language;
      
      // Set preferred voice if available
      if (this.preferredVoiceIndex !== null) {
        const voices = this.synth.getVoices();
        if (this.preferredVoiceIndex < voices.length) {
          this.currentUtterance.voice = voices[this.preferredVoiceIndex];
        }
      }

      // Event handlers
      this.currentUtterance.onstart = () => {
        this.isPlaying = true;
        if (onStart) onStart();
      };

      this.currentUtterance.onend = () => {
        this.isPlaying = false;
        if (onEnd) onEnd();
      };

      this.currentUtterance.onerror = (error) => {
        this.isPlaying = false;
        console.error('Speech synthesis error:', error);
        if (onError) onError(error);
      };

      // Speak
      this.synth.speak(this.currentUtterance);
    } catch (err) {
      console.error('Text-to-speech error:', err);
      this.isPlaying = false;
      if (onError) onError(err);
    }
  }

  /**
   * Stop current speech
   */
  stop() {
    if (this.synth.speaking || this.synth.pending) {
      this.synth.cancel();
    }
    this.isPlaying = false;
  }

  /**
   * Pause current speech
   */
  pause() {
    if (this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
    }
  }

  /**
   * Resume paused speech
   */
  resume() {
    if (this.synth.paused) {
      this.synth.resume();
    }
  }

  /**
   * Check if speech is currently playing
   */
  isPlayingAudio() {
    return this.isPlaying || this.synth.speaking;
  }

  /**
   * Get available voices
   */
  getVoices() {
    return this.synth.getVoices();
  }

  /**
   * Set voice by index
   */
  setVoice(voiceIndex) {
    const voices = this.getVoices();
    if (voiceIndex < voices.length && this.currentUtterance) {
      this.currentUtterance.voice = voices[voiceIndex];
    }
  }
}

// Export singleton instance
export const ttsService = new TextToSpeechService();

export default TextToSpeechService;
