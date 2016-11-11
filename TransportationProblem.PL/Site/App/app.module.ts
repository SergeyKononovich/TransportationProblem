import { NgModule }             from '@angular/core';
import { BrowserModule }        from '@angular/platform-browser';
import { FormsModule }          from '@angular/forms';
import { MdlModule }            from 'angular2-mdl';
import { MdlSelectModule }      from '@angular2-mdl-ext/select';
import { ResponsiveModule }     from 'ng2-responsive';

import { AppComponent }             from './app.component';
import { TransportationProblem }    from './TransportationProblem/transportation-problem.component';
import { JohnsonSchedulingProblem } from './JohnsonSchedulingProblem/johnson-scheduling-problem.component';
import { appRoutingModule }         from './app.routing';


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        MdlModule,
        MdlSelectModule,
        ResponsiveModule,
        appRoutingModule
    ],
    declarations: [
        AppComponent,
        TransportationProblem,
        JohnsonSchedulingProblem
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
