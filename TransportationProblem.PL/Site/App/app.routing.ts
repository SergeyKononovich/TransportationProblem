import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransportationProblem } from './TransportationProblem/transportation-problem.component';


const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/TransportationProblem',
        pathMatch: 'full'
    },
    {
        path: 'TransportationProblem',
        component: TransportationProblem
    }
];

export const appRoutingModule: ModuleWithProviders = RouterModule.forRoot(appRoutes);
