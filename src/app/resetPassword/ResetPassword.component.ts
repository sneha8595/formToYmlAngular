import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';

import { first } from 'rxjs/operators';

// import { AlertService, UserService } from '../_services';

@Component({templateUrl: 'ResetPassword.component.html'})
export class ResetPasswordComponent implements OnInit {
    resetPasswordForm: FormGroup;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService
        // private userService: UserService,
        // private alertService: AlertService
        ) { }

    ngOnInit() {
        this.resetPasswordForm = this.formBuilder.group({
            userName: ['', Validators.required],
        });
    }
    
    onSubmit() {
        let that = this;
        this.submitted = true;

        // stop here if form is invalid
        if (this.resetPasswordForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.setNewPassword(this.resetPasswordForm.controls.userName.value, function (success) {
            if (success){
                that.router.navigate(['/login']);
            }
            else {
                that.loading = false;

            }
        });
    }
}
