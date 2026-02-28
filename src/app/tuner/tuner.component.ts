import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tuner',
  templateUrl: './tuner.component.html',
  styleUrls: ['./tuner.component.css'],
  imports: [FormsModule, CommonModule]
})
export class TunerComponent implements OnDestroy {
  tuningMethod: string = 'byEar'; // Default tuning method
  readonly notes: string[] = ['E', 'A', 'D', 'G', 'B', 'e'];
  selectedNote: string = '';
  selectedTuning: string = 'standard';

  private audioFiles: { [note: string]: HTMLAudioElement } = {}; // Store audio elements
  private currentAudio: HTMLAudioElement | null = null; // Track currently playing audio
  private currentAudioListener: (() => void) | null = null; // Track listener to remove it

  constructor() {
    this.loadAudioFiles(); // Load audio files when the component initializes
  }

  private loadAudioFiles() {
    this.notes.forEach(note => {
      const filename = note === 'e' ? 'high_e' : note;
      const audio = new Audio(`assets/${filename}.ogg`);
      audio.preload = 'auto';
      this.audioFiles[note] = audio;
    });
  }

  setTuningMethod(method: string) {
    this.stopCurrentAudio();
    this.tuningMethod = method;
    // Implement logic to switch between tuning methods (by ear/auto)
  }

  selectNote(note: string) {
    if (this.tuningMethod === 'byEar' && this.audioFiles[note]) {
      this.playNote(note);
    }
  }

  private playNote(note: string) {
    // Stop any currently playing audio
    this.stopCurrentAudio();

    const audio = this.audioFiles[note];
    this.currentAudio = audio;
    this.selectedNote = note;

    const onEnded = () => {
      if (this.currentAudio !== audio) {
        return;
      }

      this.selectedNote = '';
      this.currentAudio = null;
      this.currentAudioListener = null;
    };

    this.currentAudioListener = onEnded;
    audio.addEventListener('ended', onEnded, { once: true });

    audio.currentTime = 0; // Reset to start
    audio.play().catch(error => {
      console.error('Error playing sound:', error);

      // Avoid stopping a newer note if this promise rejects after another click.
      if (this.currentAudio === audio) {
        this.stopCurrentAudio(); // Reset on error
      }
    });
  }

  private stopCurrentAudio() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;

      if (this.currentAudioListener) {
        this.currentAudio.removeEventListener('ended', this.currentAudioListener);
        this.currentAudioListener = null;
      }

      this.currentAudio = null;
      this.selectedNote = '';
    }
  }

  selectTuning(tuning: string) {
    this.selectedTuning = tuning;
    // Implement logic to change the tuning (e.g., update the displayed notes)
  }

  ngOnDestroy() {
    this.stopCurrentAudio(); // Ensure audio stops when component is destroyed
  }
}
