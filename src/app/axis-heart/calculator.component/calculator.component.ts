// angular
import { Component, OnInit, OnDestroy, HostBinding } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
// services and helpers
import { verifyNum, checkMinimum, checkMaximum, allValuesNotZero, sumOfValuesNotZero } from "../../helpers/validators";
import { AxisCalculator } from "../services/axis_calculator.service";
import { AppState } from "../../services/app_state.service";
import { fadeIn } from "../../services/animations";
// components
import { SumFieldComponent } from "../../shared/sum_field.component/sum_field.component";

@Component ({
  selector: 'calc',
  templateUrl: "./calculator.component.html",
  animations: [
    fadeIn
  ],
  host: { '[@fadeIn]': '' }
})

export class CalculatorComponent implements OnInit, OnDestroy {
  calculatorForm: FormGroup;
  sumI: AbstractControl;
  sumIII: AbstractControl;
  r1: AbstractControl;
  qs1: AbstractControl;
  r3: AbstractControl;
  qs3: AbstractControl;
  outputValue: string;
  useSums: boolean;
  formInvalid: boolean = false;
  @HostBinding('class.container') container: boolean = true;

  constructor (
    fb: FormBuilder,
    public axisCalculatorModel: AxisCalculator,
    public state: AppState
  ) {
    this.calculatorForm = fb.group({
        'sumI': [
          this.axisCalculatorModel.settings.maxSum.initValue,
          Validators.compose(
            [
              Validators.required,
              verifyNum,
              checkMinimum (this.axisCalculatorModel.maxSum.min),
              checkMaximum (this.axisCalculatorModel.maxSum.max)
            ]
          )
        ],
        'sumIII': [
          this.axisCalculatorModel.settings.maxSum.initValue,
          Validators.compose(
            [
              Validators.required,
              verifyNum,
              checkMinimum (this.axisCalculatorModel.maxSum.min),
              checkMaximum (this.axisCalculatorModel.maxSum.max)
            ]
          )
        ],
        'r1': [
          this.axisCalculatorModel.settings.maxWave.initR,
          Validators.compose(
            [
              Validators.required,
              verifyNum,
              checkMinimum (this.axisCalculatorModel.maxWave.min),
              checkMaximum (this.axisCalculatorModel.maxWave.max)
            ]
          )
        ],
        'qs1': [
          this.axisCalculatorModel.settings.maxWave.initQS,
          Validators.compose(
            [
              Validators.required,
              verifyNum,
              checkMinimum (this.axisCalculatorModel.maxWave.min),
              checkMaximum (this.axisCalculatorModel.maxWave.max)
            ]
          )
        ],
        'r3': [
          this.axisCalculatorModel.settings.maxWave.initR,
          Validators.compose(
            [
              Validators.required,
              verifyNum,
              checkMinimum (this.axisCalculatorModel.maxWave.min),
              checkMaximum (this.axisCalculatorModel.maxWave.max)
            ]
          )
        ],
        'qs3': [
          this.axisCalculatorModel.settings.maxWave.initQS,
          Validators.compose(
            [
              Validators.required,
              verifyNum,
              checkMinimum (this.axisCalculatorModel.maxWave.min),
              checkMaximum (this.axisCalculatorModel.maxWave.max)
            ]
          )
        ],
    }, { validator: Validators.compose(
        [
          allValuesNotZero ('sumI', 'sumIII'),
          sumOfValuesNotZero (['r1', 'qs1'], ['r3', 'qs3']),
        ]
      )
    });

    this.sumI = this.calculatorForm.controls['sumI'];
    this.sumIII = this.calculatorForm.controls['sumIII'];
    this.r1 = this.calculatorForm.controls['r1'];
    this.qs1 = this.calculatorForm.controls['qs1'];
    this.r3 = this.calculatorForm.controls['r3'];
    this.qs3 = this.calculatorForm.controls['qs3'];

    this.calculatorForm.valueChanges.subscribe (() => {
      this.displayValue ();
    });

    this.useSums = this.state.getValue ('useSums').use;
  }

  ngOnInit (): void {
    let formValue = sessionStorage.getItem('lastSums');

    if (formValue !== null) {
      this.calculatorForm.setValue (JSON.parse(formValue));
    }

    if (this.useSums) {
      this.resetWaves ();
    } else {
      this.resetSums ();
    }
  }

  ngOnDestroy (): void {
    sessionStorage.setItem('lastSums', JSON.stringify(this.calculatorForm.value));
  }

  getValue (): number {
    if (this.useSums) {
      return this.axisCalculatorModel.countAngle(this.sumI.value, this.sumIII.value);
    } else {
      return this.axisCalculatorModel.countSumsThenAngle(
        this.r1.value,
        this.qs1.value,
        this.r3.value,
        this.qs3.value
      );
    }
  }

  displayValue (): void {
    if (this.calculatorForm.invalid) {
      this.formInvalid = true;
      this.outputValue = 'ERROR';
    } else {
      let result: number = this.getValue();

      this.formInvalid = isNaN(result);
      if (isNaN(result)) {
        this.outputValue = 'ERROR';
      }

      this.outputValue = `${result}°`;
    }
  }

  reset (event: MouseEvent): void {
    event.preventDefault ();
    this.resetSums ();
    this.resetWaves ();
  }

  resetSums (): void {
    this.sumI.reset (this.axisCalculatorModel.settings.maxSum.initValue);
    this.sumIII.reset (this.axisCalculatorModel.settings.maxSum.initValue);
  }

  resetWaves (): void {
    this.r1.reset (this.axisCalculatorModel.settings.maxWave.initR);
    this.qs1.reset (this.axisCalculatorModel.settings.maxWave.initQS);
    this.r3.reset (this.axisCalculatorModel.settings.maxWave.initR);
    this.qs3.reset (this.axisCalculatorModel.settings.maxWave.initQS);
  }
}