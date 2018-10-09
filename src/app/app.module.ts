import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { routing } from './app.routing';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { ResetPasswordComponent } from './resetPassword';
import { AlertComponent } from './alert/alert.component';

import { AuthGuard } from './_guards';
import { AuthenticationService } from './authentication.service';
import { CookieService } from 'ngx-cookie-service';
import { AlertService } from './alert.service';

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        routing,
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        ResetPasswordComponent,
    ],
    providers: [
        AuthGuard,
        AlertService,
        AuthenticationService,
        CookieService
    ],
    bootstrap: [AppComponent]
})

export class AppModule {

}