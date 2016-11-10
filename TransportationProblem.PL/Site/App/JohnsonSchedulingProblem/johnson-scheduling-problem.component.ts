import { Component, ElementRef, ViewChild }    from '@angular/core';
import { MdlDefaultTableModel, MdlDialogService, IMdlTableModelItem } from 'angular2-mdl';
import { Dictionary }                   from 'typescript-collections/dist/lib';
import * as Arrays                      from 'typescript-collections/dist/lib/arrays';

import { JohnsonTask, Machine, Task }   from '../../Modules/johnson-scheduling-problem';


class TableMachine implements IMdlTableModelItem {
    public name: string = '';
    public selected: boolean = false;


    public copy(): TableMachine {
        let copy = new TableMachine();
        copy.name = this.name;

        return copy;
    }
}


interface MachineTask {
    machine: string;
    time: string;
}


class TableTask implements IMdlTableModelItem {
    public name: string = '';
    public targets: MachineTask[] = [];
    public selected: boolean = false;


    public copy(): TableTask {
        let copy = new TableTask();
        copy.name = this.name;

        for

        return copy;
    }
}


@Component({
    selector: 'johnson-scheduling-problem-component',
    templateUrl: './johnson-scheduling-problem.component.html',
    styleUrls: ['./johnson-scheduling-problem.component.scss']
})
export class JohnsonSchedulingProblem {    
    //// Condition area
    // Machine area
    private _newMachine = new TableMachine();
    private _machinesTableModel = new MdlDefaultTableModel([
        { key: 'name', name: 'Название', sortable: true },
    ]);
    private _isMachinesDeleteButtonVisible: boolean = false;

    // Task area
    private _newTask = new TableTask();
    private _tasksTableModel = new MdlDefaultTableModel([
        { key: 'name', name: 'Название', sortable: true },
    ]);
    private _isTasksDeleteButtonVisible: boolean = false;
    //// Condition area end

    
    //// Answer area
    private _taskSolver = new JohnsonTask();
    //// Answer area end


    constructor(private _dialogService: MdlDialogService) {
    } 


    //// Condition area
    // Vertecies area
    private emptyNewMachine(): void {
        this._newMachine.name = '';
    }
    private addNewMachine(): void {
        if (!this.validateNewMachine())
            return;

        this._machinesTableModel.data.push(this._newMachine.copy());

        this.emptyNewMachine();
    }
    private validateNewMachine(): boolean {

        if (this._newMachine.name.trim() === '') {
            this._dialogService.alert("Название участника не может быть пустым!", "Да понял я, понял!", "Ошибка");
            return false;
        }

        return true;
    }
    private deleteSelectedVertices(): void {
        // Get all selected machines
        let selectedVertecies = this._machinesTableModel.data.filter(value => value.selected);

        // Delete selected machines
        for (let machine of selectedVertecies)
            Arrays.remove(this._machinesTableModel.data, machine);


        this.recalcVisibilityOfVerticesDeleteButton();
        this.recalcVisibilityOfTasksDeleteButton();

        // Empty newTask
        this.emptyNewTask();

        this.renderConditionGraph();
    }
    private machinesTableSelectionChanged(event: any): void {
        this.recalcVisibilityOfVerticesDeleteButton();
    }
    private recalcVisibilityOfVerticesDeleteButton(): void {
        this._isMachinesDeleteButtonVisible = this._machinesTableModel
            .data.some((value: IMdlTableModelItem) => value.selected);
    }

    // Tasks area
    private emptyNewTask(): void {
        this._newTask.source = '';
        this._newTask.slink = '';
        this._newTask.rate = '';
    }
    private addNewTask(): void {
        if (!this.validateNewTask())
            return;

        this._tasksTableModel.data.push(this._newTask.copy());

        this.emptyNewTask();

        this.renderConditionGraph();
    }
    private validateNewTask(): boolean {

        if (this._newTask.source === '') {
            this._dialogService.alert("Отправитель не указан!", "Да понял я, понял!", "Ошибка");
            return false;
        }

        if (this._newTask.slink === '') {
            this._dialogService.alert("Получатель не указан!", "Да понял я, понял!", "Ошибка");
            return false;
        }

        if (typeof (this._newTask.rate) === 'undefined' || this._newTask.rate.trim() === '') {
            this._dialogService.alert("Не задано поле 'ставка'!", "Да понял я, понял!", "Ошибка");
            return false;
        }

        let rate: number = +this._newTask.rate;
        if (isNaN(rate) || rate === 0) {
            this._dialogService.alert("Поле 'ставка' должно быть числом!", "Да понял я, понял!", "Ошибка");
            return false;
        }

        return true;
    }
    private deleteSelectedTasks(): void {
        let selectedTasks = this._tasksTableModel.data.filter(value => value.selected);
        for (let task of selectedTasks) {
            Arrays.remove(this._tasksTableModel.data, task);
        }

        this.recalcVisibilityOfTasksDeleteButton();

        this.renderConditionGraph();
    }
    private tasksTableSelectionChanged(event: any): void {
        this.recalcVisibilityOfTasksDeleteButton();
    }
    private recalcVisibilityOfTasksDeleteButton(): void {
        this._isTasksDeleteButtonVisible = this._tasksTableModel
            .data.some((value: IMdlTableModelItem) => value.selected);
    }
    private getDataForTaskSlinkSelector(): IMdlTableModelItem[] {
        return this._machinesTableModel.data.filter((machine: TableMachine) =>
            machine.name !== this._newTask.source &&
            !this._tasksTableModel.data.some((task: TableTask) => task.source === this._newTask.source && task.slink === machine.name));
    }

    // Graph area
    private renderConditionGraph(): void {

        this._conditionGraph.remove(this._conditionGraph.elements("*"));

        for (let el of this._machinesTableModel.data) {
            let machine = el as TableMachine;
            if (+machine.power < 0)
                this._conditionGraph.add([{ group: "nodes", data: { id: machine.name }, classes: 'provider' }]);
            else
                this._conditionGraph.add([{ group: "nodes", data: { id: machine.name }, classes: 'consumers' }]);
        }

        for (let el of this._tasksTableModel.data) {
            let task = el as TableTask;
            this._conditionGraph.add([
                { group: "edges", data: { id: task.source + task.slink, source: task.source, target: task.slink, rate: task.rate } }
            ]);
        }

        this._conditionGraph.layout({
            name: 'cose-bilkent',
            padding: 60
        });
    }
    //// Condition area end
}
