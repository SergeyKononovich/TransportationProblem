import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BaseFormComponent } from './base-form.component';
import { NetworkFormComponent } from './network-form.component';


const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/BaseForm',
        pathMatch: 'full'
    },
    {
        path: 'BaseForm',
        component: BaseFormComponent
    },
    {
        path: 'NetworkForm',
        component: NetworkFormComponent
    }
];

export const appRoutingModule: ModuleWithProviders = RouterModule.forRoot(appRoutes);
