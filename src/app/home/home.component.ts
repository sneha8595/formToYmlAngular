import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as yaml from "write-yaml";

// import { User } from '../_models';
// import { UserService } from '../_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
    detailsForm: any;
    constructor(private formBuilder: FormBuilder) { }
    // convenience getter for easy access to form fields
    get f() { return this.detailsForm.controls; }

    onSubmit() {
        const data = { users: [{ user: this.detailsForm.controls }] };
        yaml('data/' + this.detailsForm.controls['User Name'] + '.yml', data, function (err) {
            
        });
    }

    ngOnInit() {
    }
}