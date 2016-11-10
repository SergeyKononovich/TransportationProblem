import { Component, ElementRef, ViewChild }    from '@angular/core';
import { MdlDefaultTableModel, MdlDialogService, IMdlTableModelItem } from 'angular2-mdl';
import { Dictionary }           from 'typescript-collections/dist/lib';
import * as Arrays              from 'typescript-collections/dist/lib/arrays';

import { Network, Vertex, Arc } from '../../Modules/transportation-problem';


@Component({
    selector: 'transportation-problem-component',
    templateUrl: './transportation-problem.component.html',
    styleUrls: ['./transportation-problem.component.scss']
})
export class JohnsonSchedulingProblem {

    constructor(private _dialogService: MdlDialogService) {
    }  
}
