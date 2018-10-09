import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { CookieService } from 'ngx-cookie-service';
import { AlertService } from '../alert.service';

@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    cookieValue = 'dwjdhwuidywdyw89dywdwdywideywuidewjedhwuiy';

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private cookieService: CookieService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
        this.cookieService.delete('user');
        // reset login status
        this.authenticationService.signOut();

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        let that = this;
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            that.alertService.error('Invalid credentials. Please try again');
            return;
        }

        this.loading = true;
        this.authenticationService.login(this.f.username.value, this.f.password.value, function (success) {
            if (success) {
                that.alertService.success('Successfully Logged in.');
                that.cookieService.set('user', that.cookieValue, 1 / (24 * 6));
                that.router.navigate([that.returnUrl]);
            }
            else {
                that.loading = false;
                that.alertService.error('Invalid credentials. Please try again');
            }
        });

    }
}
