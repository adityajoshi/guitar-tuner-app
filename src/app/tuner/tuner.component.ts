import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tuner',
  templateUrl: './tuner.component.html',
  styleUrls: ['./tuner.component.css'],
  imports: [FormsModule, CommonModule]
})
export class TunerComponent {
  tuningMethod: string = 'byEar'; // Default tuning method
  notes: string[] = ['E','A','D','G', 'B', 'e'];
  selectedNote: string = '';
  selectedTuning: string = 'standard';

  private audioFiles: { [note: string]: HTMLAudioElement } = {}; // Store audio elements

  constructor() {
    this.loadAudioFiles(); // Load audio files when the component initializes
  }

  private loadAudioFiles() {
    const notes = ['E', 'D', 'G', 'A', 'B', 'e']; // Notes for which you have audio files
    notes.forEach(note => {
      this.audioFiles[note] = new Audio(`assets/${note}.ogg`);
    });
  }

  
  setTuningMethod(method: string) {
    this.tuningMethod = method;
    // Implement logic to switch between tuning methods (by ear/auto)
  }

  selectNote(note: string) {
    this.selectedNote = note;

    if (this.tuningMethod === 'byEar' && this.audioFiles[note]) {
      const audio = this.audioFiles[note]; // Get the audio element

      audio.play();
      
      // Add event listener for 'ended' event
      audio.addEventListener('ended', () => {
        this.selectedNote = ''; // Reset the selected note
      }, { once: true }); // Important: Use { once: true } to remove listener after it fires

      // Optional: Error handling
      audio.addEventListener('error', (error) => {
          console.error('Error playing sound:', error);
          this.selectedNote = ''; // Reset on error as well
      }, { once: true });
    }
  }

  selectTuning(tuning: string) {
    this.selectedTuning = tuning;
    // Implement logic to change the tuning (e.g., update the displayed notes)
  }

  stopLooping() {
    for (const note in this.audioFiles) {
        this.audioFiles[note].loop = false;
        this.audioFiles[note].pause();
        this.audioFiles[note].currentTime = 0;
    }
}
}