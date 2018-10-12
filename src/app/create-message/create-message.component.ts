import { Component, OnInit } from "@angular/core";
import {FormControl, FormGroup, FormBuilder, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';

import { AlertService } from "../alert.service";

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  templateUrl: "create-message.component.html",
  styleUrls: ["create-message.component.css"]
})
export class CreateMessageComponent implements OnInit {
  createMessageForm: FormGroup;
  loading: Boolean = false;
  submitted = false;
  dialogResult = "";
  instantSend: Boolean = true;
  matcher = new MyErrorStateMatcher();

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService
  ) {}

  onSubmit() {
    this.submitted = true;
    if (this.createMessageForm.invalid) {
      return;
    }
    let that = this;
    const data = { users: [{ user: this.createMessageForm.value }] };
  }

  ngOnInit() {
    this.createMessageForm = this.formBuilder.group({
      mobileNumber: ["", Validators.required],
      textMessage: [],
      recordMessage: []
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.createMessageForm.controls;
  }

  saveReminder() {}
}
