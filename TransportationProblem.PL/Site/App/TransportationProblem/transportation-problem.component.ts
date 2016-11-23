import { Component, ElementRef, ViewChild }    from '@angular/core';
import { MdlDefaultTableModel, MdlDialogService, IMdlTableModelItem } from 'angular2-mdl';
import { Dictionary }           from 'typescript-collections/dist/lib';
import * as Arrays              from 'typescript-collections/dist/lib/arrays';

var Cytoscape = require('cytoscape');
var regCose = require('cytoscape-cose-bilkent/src');

import { Network, Vertex, Arc } from '../../Modules/transportation-problem';
import { ExcelTransportationProblemExport, TransportationProblemSample } from '../../Modules/import-export';


export class TableVertex implements IMdlTableModelItem {
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

export class TableArc implements IMdlTableModelItem {
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

export class TableAnswer implements IMdlTableModelItem {
    public source: string = '';
    public slink: string = '';
    public rate: string = '';
    public flow: number = 0;
    public price: number = 0;
    public selected: boolean = false;


    public copy(): TableAnswer {
        let copy = new TableAnswer();
        copy.source = this.source;
        copy.slink = this.slink;
        copy.rate = this.rate;
        copy.flow = this.flow;
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

    private _excelTransportationProblemExport: ExcelTransportationProblemExport = null;

    //// Condition area
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
    @ViewChild('conditionGraphCanvas')
    private _conditionGraphCanvas: ElementRef; 
    private _conditionGraph: any;
    //// Condition area end


    //// Answer area
    private _network: Network;
    // Arcs area
    private _answerTableModel = new MdlDefaultTableModel([
        { key: 'source', name: 'Отправитель', sortable: true },
        { key: 'slink', name: 'Получатель', sortable: true },
        { key: 'flow', name: 'Поставка', sortable: true, numeric: true },
        { key: 'price', name: 'Стоимость', sortable: true, numeric: true }
    ]);
    private _currentArcsInNetwork: Arc[];
    // Graph area
    @ViewChild('answerGraphCanvas')
    private _answerGraphCanvas: ElementRef;
    private _answerGraph: any;
    //// Answer area end


    constructor(private _dialogService: MdlDialogService) {
    }


    ngAfterViewInit(): void {

        regCose(Cytoscape);

        this._conditionGraph = Cytoscape({

            container: this._conditionGraphCanvas.nativeElement,

            style: [ // the stylesheet for the graph
                {
                    selector: 'node',
                    style: {
                        'background-color': '#C6FF00',
                        'label': 'data(label)',
                        'text-rotation': 'autorotate'
                    }
                },

                {
                    selector: 'edge',
                    style: {
                        'width': 3,
                        'label': 'data(rate)',
                        'text-margin-y': -10,
                        'color': '#83460b',
                        'text-rotation': 'autorotate',
                        'curve-style': 'bezier',
                        'line-color': '#536d6d',
                        'target-arrow-color': '#536d6d',
                        'target-arrow-shape': 'triangle'
                    }
                },

                {
                    selector: '.provider',
                    style: {
                        'background-color': '#E53935',
                        'color': '#E53935'
                    }
                },

                {
                    selector: '.consumers',
                    style: {
                        'background-color': '#689F38',
                        'color': '#689F38'
                    }
                }
            ],

            zoom: 1,
            minZoom: 0.3,
            maxZoom: 1.5
        });

        this._answerGraph = Cytoscape({

            container: this._answerGraphCanvas.nativeElement,

            style: [
                {
                    selector: 'node',
                    style: {
                        'background-color': '#C6FF',
                        'label': 'data(id)',
                        'text-rotation': 'autorotate'
                    }
                },

                {
                    selector: 'edge',
                    style: {
                        'width': 3,
                        'label': 'data(label)',
                        'color': '#231e8b',
                        'text-margin-y': -10,
                        'text-rotation': 'autorotate',
                        'curve-style': 'bezier',
                        'line-color': '#536d6d',
                        'target-arrow-color': '#536d6d',
                        'target-arrow-shape': 'triangle'
                    }
                },

                {
                    selector: '.provider',
                    style: {
                        'background-color': '#E53935',
                        'color': '#E53935'
                    }
                },

                {
                    selector: '.consumers',
                    style: {
                        'background-color': '#689F38',
                        'color': '#689F38'
                    }
                }
            ],

            zoom: 1,
            minZoom: 0.3,
            maxZoom: 1.5
        });
    }


    fileChanged(input: any): void {
        let reader = new FileReader();
        
        reader.addEventListener("load", (event: any) => {
            let data = event.target.result;
            this._excelTransportationProblemExport = new ExcelTransportationProblemExport(data);
            let sheetName = this._excelTransportationProblemExport.GetSheetsNames()[0];
            let samples = this._excelTransportationProblemExport.GetSamples(sheetName, 'D9');
        }, false);

        reader.readAsBinaryString(input.target.files[0]);
    }

    //// Condition area
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

        if (typeof (this._newVertex.name) === 'undefined' || this._newVertex.name.trim() === '') {
            this._dialogService.alert("Название узла не может быть пустым!", "Ок", "Ошибка");
            return false;
        }

        if (this._verticesTableModel.data.some((value: TableVertex) => value.name === this._newVertex.name)) {
            this._dialogService.alert("Узел с таким названием уже существует!", "Ок", "Ошибка");
            return false;
        }

        if (this._newVertex.power.trim() === '') {
            this._dialogService.alert("Не задано поле 'мощность' узла!", "Ок", "Ошибка");
            return false;
        }

        let power: number = +this._newVertex.power;
        if (isNaN(power) || power === 0) {
            this._dialogService.alert("Поле 'мощность' должно быть числом!", "Ок", "Ошибка");
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

        this.renderConditionGraph();
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

        this.renderConditionGraph();
    }
    private validateNewArc(): boolean {

        if (typeof (this._newArc.source) === 'undefined' || this._newArc.source === '') {
            this._dialogService.alert("Отправитель не указан!", "Ок", "Ошибка");
            return false;
        }

        if (typeof (this._newArc.slink) === 'undefined' || this._newArc.slink === '') {
            this._dialogService.alert("Получатель не указан!", "Ок", "Ошибка");
            return false;
        }

        if (typeof (this._newArc.rate) === 'undefined' || this._newArc.rate.trim() === '') {
            this._dialogService.alert("Не задано поле 'ставка'!", "Ок", "Ошибка");
            return false;
        }

        let rate: number = +this._newArc.rate;
        if (isNaN(rate) || rate === 0) {
            this._dialogService.alert("Поле 'тариф' должно быть числом отличным от 0!", "Ок", "Ошибка");
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

        this.renderConditionGraph();
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
    private renderConditionGraph(): void {
        
        this._conditionGraph.remove(this._conditionGraph.elements("*"));

        for (let el of this._verticesTableModel.data) {
            let vert = el as TableVertex;
            let label = vert.name + ' (' + vert.power + ')';
            if (+vert.power > 0)
                this._conditionGraph.add([{
                    group: "nodes",
                    data: {
                        id: vert.name, label: label },
                    classes: 'provider'
                }]);
            else
                this._conditionGraph.add([{
                    group: "nodes",
                    data: { id: vert.name, label: label },
                    classes: 'consumers'
                }]);
        }

        for (let el of this._arcsTableModel.data) {
            let arc = el as TableArc;
            this._conditionGraph.add([
                { group: "edges", data: { id: arc.source + arc.slink, source: arc.source, target: arc.slink, rate: arc.rate } }
            ]);
        }

        this._conditionGraph.layout({
            name: 'cose-bilkent',
            padding: 100,
            idealEdgeLength: 70
        });
    }
    private restructConditionGraph(): void {
        this._conditionGraph.layout({
            name: 'cose-bilkent',
            padding: 100,
            idealEdgeLength: 70
        });
    }
    //// Condition area end


    //// Calc area
    private calcAnswer(): void {
        try {
            let newNetwork = new Network();

            let vertices = new Dictionary<string, Vertex>();
            for (let el of this._verticesTableModel.data) {
                let vertTable = el as TableVertex;
                let vert = new Vertex(vertTable.name, +vertTable.power, vertTable.priority);
                vertices.setValue(vert.name, vert);
                newNetwork.addVertex(vert);
            }

            this._currentArcsInNetwork = [];
            for (let el of this._arcsTableModel.data) {
                let arcTable = el as TableArc;
                let arc = new Arc(vertices.getValue(arcTable.source), vertices.getValue(arcTable.slink), +arcTable.rate);
                this._currentArcsInNetwork.push(arc);
                newNetwork.addArc(arc);
            }
            newNetwork.optimize();
            this._network = newNetwork;
            this.initAnswerTable();
            this.renderAnswerGraph();
            this._dialogService.alert("Оптимальный план перевозок построен!", "Ок", "Успех");
        }
        catch (error) {
            this._dialogService.alert(error, "Ок", "Ошибка");
        }
    }
    //// Calc area end


    //// Answer area
    // Vertecies area
    private initAnswerTable(): any {

        this._answerTableModel.data = [];
        let els = this._currentArcsInNetwork.map((arc: Arc) => {
            let answer = new TableAnswer();
            answer.source = arc.source.name;
            answer.slink = arc.slink.name;
            answer.flow = arc.flow;
            answer.rate = arc.rate.toString();
            answer.price = answer.flow * arc.rate;
            answer.selected = true;

            return answer;
        })

        this._answerTableModel.data.push(...els);
    }
    private answerTableSelectionChanged(event: any): void {
        this.renderAnswerGraph();
    }

    // Graph area
    private renderAnswerGraph(): void {

        this._answerGraph.remove(this._answerGraph.elements("*"));

        for (let el of this._verticesTableModel.data) {
            let vert = el as TableVertex;
            if (+vert.power > 0)
                this._answerGraph.add([{ group: "nodes", data: { id: vert.name }, classes: 'provider' }]);
            else
                this._answerGraph.add([{ group: "nodes", data: { id: vert.name }, classes: 'consumers' }]);
        }

        for (let el of this._answerTableModel.data.filter(el => el.selected)) {
            let arc = el as TableAnswer;
            let label = arc.flow + ' (' + arc.price + ')';
            this._answerGraph.add([
                { group: "edges", data: { id: arc.source + arc.slink, source: arc.source, target: arc.slink, label: label } }
            ]);
        }

        this._answerGraph.layout({
            name: 'cose-bilkent',
            padding: 100,
            idealEdgeLength: 130
        });
    }
    private restructAnswerGraph(): void {
        this._answerGraph.layout({
            name: 'cose-bilkent',
            padding: 100,
            idealEdgeLength: 130
        });
    }
    //// Answer area end
}
