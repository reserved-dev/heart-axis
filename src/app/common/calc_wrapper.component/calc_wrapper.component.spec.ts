import { TestBed, async, ComponentFixture, } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppState } from "../../services/app_state.service";
import { CalcWrapperComponent } from "./calc_wrapper.component";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs/Observable";

class ActivatedRouteMock {
  url: Observable<any>;
  snapshot: object;

  constructor (options) {
    this.url = Observable.of(
      options.url
    );
    this.snapshot = {
      _lastPathIndex: 1,
    };
  }
}

describe ('CalcWrapperComponent', () => {
  let component: CalcWrapperComponent;
  let fixture: ComponentFixture<CalcWrapperComponent>;
  let appState: AppState;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        CalcWrapperComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: new ActivatedRouteMock (
            {
              url: [
                { path: 'heart-axis' }
              ]
            }
          )
        },
        AppState
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalcWrapperComponent);
    component = fixture.componentInstance;
    appState = TestBed.get(AppState);
    fixture.detectChanges();
  });

  it ('component exist', () => {
    expect (component).toBeTruthy ();
  });

  it ('should get title and calculatorType from state', () => {
    expect (component.title).toBeDefined();
    expect (component.calculatorType).toBeDefined();
  });
});