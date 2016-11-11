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


interface IMachineTask {
    machine: string;
    time: string;
}


class TableTask implements IMdlTableModelItem {
    public name: string = '';
    public targets: IMachineTask[] = [];
    public selected: boolean = false;


    public copy(): TableTask {
        let copy = new TableTask();
        copy.name = this.name;
        copy.targets = this.targets;

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
            this._dialogService.alert("Название машины не может быть пустым!", "Да понял я, понял!", "Ошибка");
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
        this._newTask.name = '';
        this._newTask.targets = [];
    }
    private addNewTask(): void {
        if (!this.validateNewTask())
            return;

        this._tasksTableModel.data.push(this._newTask.copy());

        this.emptyNewTask();
    }
    private validateNewTask(): boolean {

        if (this._newTask.name.trim() === '') {
            this._dialogService.alert("Название задачи не может быть пустым!", "Да понял я, понял!", "Ошибка");
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
            !this._newTask.targets.some((m: IMachineTask) => m.machine === machine.name));
    }
    //// Condition area end


    //// Calc area
    private calcAnswerUseStupidMethod(): void {
        
        try {
            
        }
        catch (error) {
            this._dialogService.alert(error, "Да понял я, понял!", "Ошибка");
        }
    }
    private calcAnswerUseHeuristicMethod(): void {

        try {

        }
        catch (error) {
            this._dialogService.alert(error, "Да понял я, понял!", "Ошибка");
        }
    }
    //// Calc area end
}
