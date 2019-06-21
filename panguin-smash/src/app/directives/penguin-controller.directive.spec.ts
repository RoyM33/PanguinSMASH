import { PenguinControllerDirective } from './penguin-controller.directive';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MapService } from '../services/map.service';
import { BlockAIService } from '../services/block-a-i.service';
import { Component, ViewChild } from '@angular/core';
import { PenguinControllerService } from '../services/penguin-controller.service';
import { Direction } from '../helpers/Directions';


describe('PenguinControllerDirective', () => {
  let directionMoved = Direction.none;
  let fixture: ComponentFixture<TestPenguinComponent>;
  let component: TestPenguinComponent;
  let MockPenguinControllerService: jasmine.SpyObj<PenguinControllerService>;
  beforeEach(async(() => {
    const MockMapService = jasmine.createSpyObj<MapService>(['Columns', 'Rows', 'GenerateNewMap']);
    const MockBlockAIService = jasmine.createSpyObj<BlockAIService>(['PenguinInteraction']);
    MockPenguinControllerService = jasmine.createSpyObj<PenguinControllerService>(['InteractUp', 'InteractDown', 'InteractLeft', 'InteractRight']);
    directionMoved = Direction.none;
    TestBed.configureTestingModule({
      declarations: [TestPenguinComponent, PenguinControllerDirective],
      providers: [{ provide: PenguinControllerService, useValue: MockPenguinControllerService },
      { provide: MockMapService, useValue: MockMapService },
      { provide: BlockAIService, useValue: MockBlockAIService }]
    });

    fixture = TestBed.createComponent(TestPenguinComponent);
    component = fixture.componentInstance;
  }));

  it('should create an instance', () => {

    expect(component).toBeTruthy();
  });

  it('should Move up', (done) => {
    MockPenguinControllerService.InteractUp.and.callFake(done);
    component.PenguinDirective.MoveUpwards();
  });

  it('should Move down', (done) => {
    MockPenguinControllerService.InteractDown.and.callFake(done);
    component.PenguinDirective.MoveDownwards();
  });

  it('should Move left', (done) => {
    MockPenguinControllerService.InteractLeft.and.callFake(done);
    component.PenguinDirective.MoveLeft();
  });

  it('should Move right', (done) => {
    MockPenguinControllerService.InteractRight.and.callFake(done);
    component.PenguinDirective.MoveRight();
  });

});

@Component({
  template: '<div penguinController>'
})
class TestPenguinComponent {

  @ViewChild(PenguinControllerDirective)
  public PenguinDirective;
}