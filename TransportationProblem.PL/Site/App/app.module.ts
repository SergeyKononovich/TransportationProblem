import { NgModule }             from '@angular/core';
import { BrowserModule }        from '@angular/platform-browser';
import { MdlModule }            from 'angular2-mdl';
import { ResponsiveModule }     from 'ng2-responsive';

import { AppComponent }         from './app.component';
import { BaseFormComponent } from './base-form.component';
import { NetworkFormComponent } from './network-form.component';
import { appRoutingModule }     from './app.routing';
import { AlgorithmService }     from '../Services/algorithm.service';


@NgModule({
    imports: [
        BrowserModule,
        MdlModule,
        ResponsiveModule,
        appRoutingModule
    ],
    declarations: [
        AppComponent,
        BaseFormComponent,
        NetworkFormComponent
    ],
    providers: [
        AlgorithmService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
