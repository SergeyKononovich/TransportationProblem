import { Component, OnInit }    from '@angular/core';
import { MdlDefaultTableModel, MdlDialogService, IMdlTableModelItem } from 'angular2-mdl';
import { Dictionary }           from 'typescript-collections/dist/lib';

import { Network, Vertex, Arc } from '../../Modules/transportation-problem';


class TableVertex implements IMdlTableModelItem {
    public name: string;
    public power: number;
    public priority: boolean;
    public selected: boolean = false;


    public copy(): TableVertex {
        let copy = new TableVertex();
        copy.name = this.name;
        copy.power = this.power;
        copy.priority = this.priority;
        copy.selected = this.selected;

        return copy;
    }
}


@Component({
    selector: 'transportation-problem-component',
    templateUrl: './transportation-problem.component.html',
    styleUrls: ['./transportation-problem.component.scss']
})
export class TransportationProblem implements OnInit {
    private _newVertex: TableVertex = new TableVertex();
    private _vertices: Dictionary<TableVertex, TableVertex> = new Dictionary<TableVertex, TableVertex>();

    public verticesTableModel = new MdlDefaultTableModel([
        { key: 'name', name: 'Название', sortable: true },
        { key: 'power', name: 'Мощность', sortable: true, numeric: true },
        { key: 'priority', name: 'Приоритет', sortable: true }
    ]);

    constructor(private _dialog: MdlDialogService) {
        //this._dialog.alert('This is a simple Alert')
        //    .subscribe(() => console.log('alert closed'));
    }


    ngOnInit() {

    }

    private addNewVertex(): void {
        this.verticesTableModel.data.push(this._newVertex.copy());
    }
}
