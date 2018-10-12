import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { ResetPasswordComponent } from './resetPassword';
import { AuthGuard } from './_guards';
import { CreateMessageComponent } from './create-message/create-message.component';

const appRoutes: Routes = [
    { path: '', component: CreateMessageComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'forgotPassword', component: ResetPasswordComponent },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);