import { Component, OnInit }    from '@angular/core';
import { MdlDefaultTableModel, MdlDialogService, IMdlTableModelItem } from 'angular2-mdl';
import { Dictionary }           from 'typescript-collections/dist/lib';
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


class TableArc implements IMdlTableModelItem {
    public source: string = '';
    public slink: string = '';
    public rate: string = '';
    public selected: boolean = false;


    public copy(): TableArc {
        let copy = new TableArc();
        copy.source = this.source;
        copy.slink = this.slink;
        copy.rate = this.rate;
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
    private _newVertex = new TableVertex();
    //private _vertices = new Dictionary<string, Vertex>();
    private _verticesTableModel = new MdlDefaultTableModel([
        { key: 'name', name: 'Название', sortable: true },
        { key: 'power', name: 'Мощность', sortable: true, numeric: true },
        { key: 'priority', name: 'Приоритет', sortable: true }
    ]);
    private _isVerticesDeleteButtonVisible: boolean = false;

    // Arcs area
    private _newArc = new TableArc();
    private _arcsTableModel = new MdlDefaultTableModel([
        { key: 'source', name: 'Отправитель', sortable: true },
        { key: 'slink', name: 'Получатель', sortable: true },
        { key: 'rate', name: 'Ставка', sortable: true, numeric: true }
    ]);
    private _isArcsDeleteButtonVisible: boolean = false;


    constructor(private _dialogService: MdlDialogService) {
    }


    ngOnInit() {

    }


    // Vertecies area
    private emptyNewVertex(): void {
        this._newVertex.name = '';
        this._newVertex.power = '';
        this._newVertex.priority = false;
    }

    private addNewVertex(): void {
        if (!this.validateNewVertex())
            return;

        this._verticesTableModel.data.push(this._newVertex.copy());

        this.emptyNewVertex();
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
        // Get all selected vertices
        let selectedVertecies = this._verticesTableModel.data.filter(value => value.selected);

        // Get all related arcs
        let relatedArcs = this._arcsTableModel.data.filter((arc: TableArc) => {
            return selectedVertecies.some((vert: TableVertex) =>
                vert.name === arc.source || vert.name === arc.slink);
        });
        
        // Delete selected vertices
        for (let vertex of selectedVertecies)
            Arrays.remove(this._verticesTableModel.data, vertex);


        // Delete related arcs
        for (let arc of relatedArcs)
            Arrays.remove(this._arcsTableModel.data, arc);

        this.recalcVisibilityOfVerticesDeleteButton();
        this.recalcVisibilityOfArcsDeleteButton();

        // Empty newArc
        this.emptyNewArc();
    }

    private verticesTableSelectionChanged(event: any): void {
        this.recalcVisibilityOfVerticesDeleteButton();
    }

    private recalcVisibilityOfVerticesDeleteButton(): void {
        this._isVerticesDeleteButtonVisible = this._verticesTableModel
            .data.some((value: IMdlTableModelItem) => value.selected);
    }


    // Arcs area
    private emptyNewArc(): void {
        this._newArc.source = '';
        this._newArc.slink = '';
        this._newArc.rate = '';
    }

    private addNewArc(): void {
        if (!this.validateNewArc())
            return;

        this._arcsTableModel.data.push(this._newArc.copy());

        this.emptyNewArc();
    }

    private validateNewArc(): boolean {

        

        return true;
    }

    private deleteSelectedArcs(): void {
        let selectedArcs = this._arcsTableModel.data.filter(value => value.selected);
        for (let arc of selectedArcs) {
            Arrays.remove(this._arcsTableModel.data, arc);
        }

        this.recalcVisibilityOfArcsDeleteButton();
    }

    private arcsTableSelectionChanged(event: any): void {
        this.recalcVisibilityOfArcsDeleteButton();
    }

    private recalcVisibilityOfArcsDeleteButton(): void {
        this._isArcsDeleteButtonVisible = this._arcsTableModel
            .data.some((value: IMdlTableModelItem) => value.selected);
    }

    private getDataForArcSlinkSelector(): IMdlTableModelItem[] {
        return this._verticesTableModel.data.filter((vert: TableVertex) =>
            vert.name !== this._newArc.source &&
            !this._arcsTableModel.data.some((arc: TableArc) => arc.source === vert.name || arc.slink === vert.name));
    } 
}
