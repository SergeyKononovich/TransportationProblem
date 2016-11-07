import { Component, ElementRef, ViewChild }    from '@angular/core';
import { MdlDefaultTableModel, MdlDialogService, IMdlTableModelItem } from 'angular2-mdl';
import { Dictionary }           from 'typescript-collections/dist/lib';
import * as Arrays              from 'typescript-collections/dist/lib/arrays';

var Cytoscape = require('cytoscape');
var regCose = require('cytoscape-cose-bilkent/src');

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
export class TransportationProblem {
    // Vertecies area
    private _newVertex = new TableVertex();
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

    // Graph area
    @ViewChild('graphCanvas')
    private _graphCanvas: ElementRef; 
    private _graph: any;


    constructor(private _dialogService: MdlDialogService) {
    }


    ngAfterViewInit(): void {
        this._graph = Cytoscape({

            container: this._graphCanvas.nativeElement, // container to render in

            style: [ // the stylesheet for the graph
                {
                    selector: 'node',
                    style: {
                        'background-color': '#666',
                        'label': 'data(id)',
                        'text-rotation': 'autorotate'
                    }
                },

                {
                    selector: 'edge',
                    style: {
                        'width': 3,
                        'label': 'data(rate)',
                        'text-margin-y': -10,
                        'text-rotation': 'autorotate',
                        'curve-style': 'bezier',
                        'line-color': '#536d6d',
                        'target-arrow-color': '#536d6d',
                        'target-arrow-shape': 'triangle'
                    }
                }
            ]
        });

        regCose(Cytoscape);
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

        this.renderGraph();
    }

    private validateNewArc(): boolean {

        if (this._newArc.source === '') {
            this._dialogService.alert("Отправитель не указан!", "Да понял я, понял!", "Ошибка");
            return false;
        }

        if (this._newArc.slink === '') {
            this._dialogService.alert("Получатель не указан!", "Да понял я, понял!", "Ошибка");
            return false;
        }

        if (this._newArc.rate.trim() === '') {
            this._dialogService.alert("Не задано поле 'ставка'!", "Да понял я, понял!", "Ошибка");
            return false;
        }

        let rate: number = +this._newArc.rate;
        if (isNaN(rate) || rate === 0) {
            this._dialogService.alert("Поле 'ставка' должно быть числом!", "Да понял я, понял!", "Ошибка");
            return false;
        }

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
            !this._arcsTableModel.data.some((arc: TableArc) => arc.source === this._newArc.source && arc.slink === vert.name));
    } 


    // Graph area
    private renderGraph(): void {
        
        this._graph.remove(this._graph.elements("*"));

        for (let el of this._verticesTableModel.data) {
            let vert = el as TableVertex;
            this._graph.add([
                { group: "nodes", data: { id: vert.name } }
            ]);
        }

        for (let el of this._arcsTableModel.data) {
            let arc = el as TableArc;
            this._graph.add([
                { group: "edges", data: { id: arc.source + arc.slink, source: arc.source, target: arc.slink, rate: arc.rate } }
            ]);
        }

        this._graph.layout({
            name: 'cose-bilkent',
            padding: 60
        });
    }
}
