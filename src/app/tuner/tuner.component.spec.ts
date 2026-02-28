import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TunerComponent } from './tuner.component';

describe('TunerComponent', () => {
  let component: TunerComponent;
  let fixture: ComponentFixture<TunerComponent>;
  let mockAudios: any[];

  beforeEach(async () => {
    mockAudios = [];

    spyOn(window, 'Audio').and.callFake(() => {
      const mockAudio = {
        play: jasmine.createSpy('play').and.returnValue(Promise.resolve()),
        pause: jasmine.createSpy('pause'),
        addEventListener: jasmine.createSpy('addEventListener'),
        removeEventListener: jasmine.createSpy('removeEventListener'),
        currentTime: 0,
        preload: ''
      };

      mockAudios.push(mockAudio);
      return mockAudio as any;
    });

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
    expect(mockAudios[0].play).toHaveBeenCalled();
    expect(component.selectedNote).toBe('E');
  });

  it('should stop previous audio when a new note is selected', () => {
    component.selectNote('E');
    expect(mockAudios[0].play).toHaveBeenCalledTimes(1);

    // Reset calls to clearer assertions
    mockAudios[0].play.calls.reset();
    mockAudios[0].pause.calls.reset();
    mockAudios[1].play.calls.reset();

    component.selectNote('A');

    expect(mockAudios[0].pause).toHaveBeenCalled();
    expect(mockAudios[0].currentTime).toBe(0);

    expect(mockAudios[1].play).toHaveBeenCalledTimes(1);
    expect(component.selectedNote).toBe('A');
  });

  it('should stop audio when toggling tuning method', () => {
    component.selectNote('E');
    mockAudios[0].pause.calls.reset();

    component.setTuningMethod('auto');

    expect(mockAudios[0].pause).toHaveBeenCalled();
  });

  it('should stop audio on destroy', () => {
    component.selectNote('E');
    mockAudios[0].pause.calls.reset();

    component.ngOnDestroy();

    expect(mockAudios[0].pause).toHaveBeenCalled();
  });

  it('should keep the latest note playing if a previous play promise rejects', async () => {
    let rejectPreviousPlay: (() => void) | undefined;
    mockAudios[0].play.and.returnValue(
      new Promise<void>((_, reject) => {
        rejectPreviousPlay = () => reject(new Error('interrupted'));
      })
    );

    component.selectNote('E');
    component.selectNote('A');

    rejectPreviousPlay?.();
    await Promise.resolve();

    expect(mockAudios[1].pause).not.toHaveBeenCalled();
    expect(component.selectedNote).toBe('A');
  });
});
