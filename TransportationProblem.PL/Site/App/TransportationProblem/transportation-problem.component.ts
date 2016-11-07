import { Component, OnInit }    from '@angular/core';
import { MdlDefaultTableModel, MdlDialogService, IMdlTableModelItem } from 'angular2-mdl';
//import { Dictionary }           from 'typescript-collections/dist/lib';
import * as Arrays              from 'typescript-collections/dist/lib/arrays';

import { Network, Vertex, Arc } from '../../Modules/transportation-problem';


class TableVertex implements IMdlTableModelItem {
    public name: string = '';
    public power: string = '';
    public priority: boolean = false;
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
    // Vertecies area
    private _newVertex: TableVertex = new TableVertex();
    private _verticesTableModel = new MdlDefaultTableModel([
        { key: 'name', name: 'Название', sortable: true },
        { key: 'power', name: 'Мощность', sortable: true, numeric: true },
        { key: 'priority', name: 'Приоритет', sortable: true }
    ]);
    private _isVerticesDeleteButtonVisible: boolean = false;

    // Arcs area


    constructor(private _dialogService: MdlDialogService) {
    }


    ngOnInit() {

    }


    // Vertecies area
    private addNewVertex(): void {
        if (!this.validateNewVertex())
            return;

        this._verticesTableModel.data.push(this._newVertex.copy());
    }

    private validateNewVertex(): boolean {

        if (this._newVertex.name.trim() === '') {
            this._dialogService.alert("Название участника не может быть пустым!", "Да понял я, понял!", "Ошибка");
            return false;
        }

        if (this._verticesTableModel.data.some((value: TableVertex) => value.name === this._newVertex.name)) {
            this._dialogService.alert("Участник с таким названием уже существует!", "Да понял я, понял!", "Ошибка");
            return false;
        }

        if (this._newVertex.power.trim() === '') {
            this._dialogService.alert("Не задано поле 'мощность' участника!", "Да понял я, понял!", "Ошибка");
            return false;
        }

        let power: number = +this._newVertex.power;
        if (isNaN(power) || power === 0) {
            this._dialogService.alert("Поле 'мощность' должно быть числом!", "Да понял я, понял!", "Ошибка");
            return false;
        }

        return true;
    }

    private deleteSelectedVertices(): void {
        let selectedVertecies = this._verticesTableModel.data.filter(value => value.selected);
        for (let vertex of selectedVertecies)
            if (vertex.selected) Arrays.remove(this._verticesTableModel.data, vertex);

        this.recalcVisibilityOfVerticesDeleteButton();
    }

    private verticesTableSelectionChanged(event: any): void {
        this.recalcVisibilityOfVerticesDeleteButton();
    }

    private recalcVisibilityOfVerticesDeleteButton(): void {
        this._isVerticesDeleteButtonVisible = this._verticesTableModel
            .data.some((value: IMdlTableModelItem) => value.selected);
    }


    // Arcs area
}
