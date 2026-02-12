import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TunerComponent } from './tuner.component';

describe('TunerComponent', () => {
  let component: TunerComponent;
  let fixture: ComponentFixture<TunerComponent>;
  let mockAudio: any;

  beforeEach(async () => {
    // Mock Audio
    mockAudio = {
      play: jasmine.createSpy('play').and.returnValue(Promise.resolve()),
      pause: jasmine.createSpy('pause'),
      addEventListener: jasmine.createSpy('addEventListener'),
      removeEventListener: jasmine.createSpy('removeEventListener'),
      currentTime: 0
    };

    spyOn(window, 'Audio').and.returnValue(mockAudio);

    await TestBed.configureTestingModule({
      imports: [TunerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TunerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should play audio when a note is selected', () => {
    component.selectNote('E');
    expect(mockAudio.play).toHaveBeenCalled();
    expect(component.selectedNote).toBe('E');
  });

  it('should stop previous audio when a new note is selected', () => {
    component.selectNote('E');
    expect(mockAudio.play).toHaveBeenCalledTimes(1);

    // Reset calls to clearer assertions
    mockAudio.play.calls.reset();
    mockAudio.pause.calls.reset();

    component.selectNote('A');

    // Check if pause was called on the PREVIOUS audio (which is the same mock object here)
    expect(mockAudio.pause).toHaveBeenCalled();
    expect(mockAudio.currentTime).toBe(0);

    // Check if play was called for the NEW note
    expect(mockAudio.play).toHaveBeenCalledTimes(1);
    expect(component.selectedNote).toBe('A');
  });

  it('should stop audio when toggling tuning method', () => {
    component.selectNote('E');
    mockAudio.pause.calls.reset();

    component.setTuningMethod('auto');

    expect(mockAudio.pause).toHaveBeenCalled();
  });

  it('should stop audio on destroy', () => {
    component.selectNote('E');
    mockAudio.pause.calls.reset();

    component.ngOnDestroy();

    expect(mockAudio.pause).toHaveBeenCalled();
  });
});
