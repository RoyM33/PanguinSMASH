import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MapService } from './services/map.service';
import { TileInterpreterComponent } from './tile-interpreter/tile-interpreter.component';
import { CommonModule } from '@angular/common';
import { PenguinControllerDirective } from './directives/penguin-controller.directive';

describe('AppComponent', () => {
  beforeEach(async(async () => {
    const MockMapService = new MapService();
    MockMapService.mapGenerationSpeed = 5;
    MockMapService.GenerateNewMap(10, 10);
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        TileInterpreterComponent,
        PenguinControllerDirective
      ],
      providers: [{ provide: MapService, useValue: MockMapService }]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'panguin-smash'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('panguin-smash');
  });

  it('should render title in  a h1 tag', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to panguin-smash!');
  });
});
