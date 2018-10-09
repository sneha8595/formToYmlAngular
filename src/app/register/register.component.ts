import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { ImageUploadS3Service } from '../image-upload-s3.service';

import { AlertService } from '../alert.service';

@Component({templateUrl: 'register.component.html'})
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private imageUploadService: ImageUploadS3Service,
        private alertService: AlertService
        ) { }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            name: ['', Validators.required],
            picture: ['', Validators.required],
            email: ['', Validators.required],
            gender: ['', [Validators.required]],
            birthdate : ['', [Validators.required]],
            phone_number: ['', [Validators.required]],
            address: ['', [Validators.required]],
            password: ['', [Validators.required]],
            passwordTwo: ['', [Validators.required]],
        });
    }

    onSubmit() {
        let that = this;
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            that.alertService.error('Invalid details. Please try again.');
            return;
        }

        if (this.registerForm.controls.password.value !== this.registerForm.controls.passwordTwo.value) {
            that.alertService.error('Passwords do not match');
            return;
        }
        delete this.registerForm.value.passwordTwo;
        
        this.registerForm.value.picture = (<any>document.getElementById('photoupload')).files;
        this.loading = true;
        this.imageUploadService.createAndAddPhoto(this.registerForm.value, (data) => {
            if(!data){
                this.loading = false;
                that.alertService.error('Something went wrong. Please try again.');
                return;
            }
            this.registerForm.value.picture = data.Location;
            this.authenticationService.registerUser(this.registerForm.value, function (success) {
                if (success){
                    that.alertService.success('Registration successful', true);
                    that.router.navigate(['/login']);
                }
                else {
                    that.loading = false;
                    that.alertService.error('Something went wrong. Please try again.');
                }
            });
        });

        
    }
}
