import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { routing } from './app.routing';

// import { AlertComponent } from './_directives';
import { AuthGuard } from './_guards';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { ResetPasswordComponent } from './resetPassword';
import { AuthenticationService } from './authentication.service';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        routing,
    ],
    declarations: [
        AppComponent,
        // AlertComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        ResetPasswordComponent,
    ],
    providers: [
        AuthGuard,
        // AlertService,
        AuthenticationService,
        CookieService
        // UserService,
    ],
    bootstrap: [AppComponent]
})

export class AppModule {

}