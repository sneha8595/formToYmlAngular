import { Component, OnInit } from "@angular/core";
import {FormControl, FormGroup, FormBuilder, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { AlertService } from "../alert.service";
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
//import {default as _rollupMoment} from 'moment';

import {ReminderHandlerService} from '../reminder-handler.service';

const moment = _moment;

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  templateUrl: "create-message.component.html",
  styleUrls: ["create-message.component.css"],
  providers: [
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class CreateMessageComponent implements OnInit {
  createReminderForm: FormGroup;
  loading: Boolean = false;
  submitted = false;
  dialogResult = "";
  instantSend: Boolean = true;
  matcher = new MyErrorStateMatcher();

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private reminderService: ReminderHandlerService
  ) {
  }

  onSubmit() {
    this.submitted = true;
    if (this.createReminderForm.invalid) {
      return;
    }
    let that = this;
    console.log(this.createReminderForm.value);
    const instantSend = this.f.selectedMode.value === 'instantSend';
    const mNumber = this.f.mobileNumber;
    const textMessage = this.f.textMessage;
    if(instantSend){
      this.reminderService.sendInstantMessage(mNumber, textMessage);
    }else{
      this.reminderService.queueReminder(mNumber, textMessage, this.f.scheduleDate);
    }    
  }

  ngOnInit() {
    this.createReminderForm = this.formBuilder.group({
      mobileNumber: ["", Validators.required],
      textMessage: [],
      selectedMode: ['instantSend'],
      scheduleDate: []
    });
    // let recorder = document.getElementById('recorder');
    // const player = document.getElementById('player');

    // // recorder.addEventListener('change', function (e) {
    // //     const file = (<any>e.target).files[0];
    // //     // Do something with the audio file.
    // //     player['src'] = URL.createObjectURL(file);
    // // });

    // let handleSuccess = function(stream) {
    //   if (window.URL) {
    //     player.src = window.URL.createObjectURL(stream);
    //   } else {
    //     player.src = stream;
    //   }
    // };
  
    // navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    //     .then(handleSuccess);
    //     let devices;
    //     navigator.mediaDevices.enumerateDevices().then((devices1) => {
    //       devices = devices1.filter((d) => d.kind === 'audioinput');
    //     });

    //     navigator.mediaDevices.getUserMedia({
    //       audio: {
    //         deviceId: devices && devices[0].deviceId
    //       }
    //     });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.createReminderForm.controls;
  }

  saveReminder() {}
}
