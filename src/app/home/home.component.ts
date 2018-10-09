import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as yaml from 'write-yaml';
import { AlertService } from '../alert.service';

@Component({
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css']
})
export class HomeComponent implements OnInit {
    detailsForm: FormGroup;
    loading: Boolean = false;
    submitted = false;

    constructor(private formBuilder: FormBuilder, private alertService: AlertService) { }

    onSubmit() {
        this.submitted = true;
        if (this.detailsForm.invalid) {
            return;
        }
        let that = this;
        const data = { users: [{ user: this.detailsForm.value }] };
        return;
        yaml('../../data/' + this.f['Username'].value + '.yml', data, function (err) {
            if (err) {
                that.alertService.error('Something went wrong. Please try again.');
                return;
            }
            that.alertService.success('Yaml file successfully created.');
        });
    }

    ngOnInit() {
        this.detailsForm = this.formBuilder.group({
            'Username': ['', Validators.required],
            'Role': [],
            'Key': [],
            'Environment': [],
        });
    }
    
    // convenience getter for easy access to form fields
    get f() { return this.detailsForm.controls; }
}