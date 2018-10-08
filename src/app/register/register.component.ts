import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { first } from 'rxjs/operators';
import { ImageUploadS3Service } from '../image-upload-s3.service';

// import { AlertService, UserService } from '../_services';

@Component({templateUrl: 'register.component.html'})
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private imageUploadService: ImageUploadS3Service
        // private userService: UserService,
        // private alertService: AlertService
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
        this.registerForm.value.picture = (<any>document.getElementById('photoupload')).files;

        // stop here if form is invalid
        if (this.registerForm.invalid || this.registerForm.controls.password.value !== this.registerForm.controls.passwordTwo.value) {
            return;
        }
        delete this.registerForm.value.passwordTwo;
        this.loading = true;
        this.imageUploadService.createAndAddPhoto(this.registerForm.value, (data) => {
            if(!data){
                return;
            }
            this.registerForm.value.picture = data.Location;
            this.authenticationService.registerUser(this.registerForm.value, function (success) {
                if (success){
                    //this.alertService.success('Registration successful', true);
                    that.router.navigate(['/login']);
                }
                else {
                    that.loading = false;
    
                }
            });
        });

        
    }
}
