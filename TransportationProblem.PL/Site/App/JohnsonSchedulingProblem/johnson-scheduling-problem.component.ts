import { Component, ElementRef, ViewChild }    from '@angular/core';
import { MdlDefaultTableModel, MdlDialogService, IMdlTableModelItem } from 'angular2-mdl';
import { Dictionary }                   from 'typescript-collections/dist/lib';
import * as Arrays                      from 'typescript-collections/dist/lib/arrays';

import { JohnsonTask, Machine, Task, Solution }   from '../../Modules/johnson-scheduling-problem';


class TableMachine implements IMdlTableModelItem {
    public name: string = '';
    public selected: boolean = false;


    public copy(): TableMachine {
        let copy = new TableMachine();
        copy.name = this.name;

        return copy;
    }
}

class TableTask implements IMdlTableModelItem {
    public name: string = '';
    public selected: boolean = false;


    public copy(): TableTask {
        let copy = new TableTask();
        copy.name = this.name;

        return copy;
    }
}

class TableMachineTask implements IMdlTableModelItem {
    public machine: string = '';
    public task: string = '';
    public time: string = '';
    public selected: boolean = false;


    public copy(): TableMachineTask {
        let copy = new TableMachineTask();
        copy.machine = this.machine
        copy.task = this.task;
        copy.time = this.time;

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

    // MachineTask area
    private _newMachineTask = new TableMachineTask();
    private _machineTasksTableModel = new MdlDefaultTableModel([
        { key: 'machine', name: 'Исполнитель', sortable: true },
        { key: 'task', name: 'Работа', sortable: true },
        { key: 'time', name: 'Время', sortable: true }
    ]);
    private _isMachineTasksDeleteButtonVisible: boolean = false;
    //// Condition area end


    //// Answer area
    private _taskSolver = new JohnsonTask();
    private _answer: Solution[] = [];
    //// Answer area end


    constructor(private _dialogService: MdlDialogService) {
    } 


    //// Condition area
    // Machines area
    private emptyNewMachine(): void {
        this._newMachine.name = '';
    }
    private addNewMachine(): void {
        if (!this.validateNewMachine())
            return;

        this._machinesTableModel.data.push(this._newMachine.copy());

        this.emptyNewMachine();

        this._answer = null;
    }
    private validateNewMachine(): boolean {
        if (this._newMachine.name.trim() === '') {
            this._dialogService.alert("Название исполнителя не может быть пустым!", "Ок", "Ошибка");
            return false;
        }

        if (this._machinesTableModel.data.some((value: TableMachine) => value.name === this._newMachine.name)) {
            this._dialogService.alert("Исполнитель с таким названием уже существует!", "Ок", "Ошибка");
            return false;
        }

        return true;
    }
    private deleteSelectedMachines(): void {
        // Get all selected machines
        let selectedMachines = this._machinesTableModel.data.filter(value => value.selected);
        
        // Get all related processes
        let relatedProc = this._machineTasksTableModel.data.filter((proc: TableMachineTask) => {
            return selectedMachines.some((m: TableMachine) => m.name === proc.machine);
        });

        // Delete selected machines
        for (let machine of selectedMachines)
            Arrays.remove(this._machinesTableModel.data, machine);
        
        // Delete related processes
        for (let proc of relatedProc)
            Arrays.remove(this._machineTasksTableModel.data, proc);

        this.recalcVisibilityOfMachinesDeleteButton();

        // Empty newTask
        this.emptyNewMachineTask();

        this._answer = null;
    }
    private machinesTableSelectionChanged(event: any): void {
        this.recalcVisibilityOfMachinesDeleteButton();
    }
    private recalcVisibilityOfMachinesDeleteButton(): void {
        this._isMachinesDeleteButtonVisible = this._machinesTableModel
            .data.some((value: IMdlTableModelItem) => value.selected);
    }

    // Tasks area
    private emptyNewTask(): void {
        this._newTask.name = '';
    }
    private addNewTask(): void {
        if (!this.validateNewTask())
            return;

        this._tasksTableModel.data.push(this._newTask.copy());

        this.emptyNewTask();

        this._answer = null;
    }
    private validateNewTask(): boolean {
        if (this._newTask.name.trim() === '') {
            this._dialogService.alert("Название работы не может быть пустым!", "Ок", "Ошибка");
            return false;
        }

        if (this._tasksTableModel.data.some((value: TableTask) => value.name === this._newTask.name)) {
            this._dialogService.alert("Работа с таким названием уже существует!", "Ок", "Ошибка");
            return false;
        }

        return true;
    }
    private deleteSelectedTasks(): void {
        // Get all selected tasks
        let selectedTasks = this._tasksTableModel.data.filter(value => value.selected);
        
        // Get all related processes
        let relatedProc = this._machineTasksTableModel.data.filter((proc: TableMachineTask) => {
            return selectedTasks.some((m: TableTask) => m.name === proc.task);
        });

        // Delete selected tasks
        for (let task of selectedTasks)
            Arrays.remove(this._tasksTableModel.data, task);
        
        // Delete related processes
        for (let proc of relatedProc)
            Arrays.remove(this._machineTasksTableModel.data, proc);

        this.recalcVisibilityOfTasksDeleteButton();

        // Empty newTask
        this.emptyNewMachineTask();

        this._answer = null;
    }
    private tasksTableSelectionChanged(event: any): void {
        this.recalcVisibilityOfTasksDeleteButton();
    }
    private recalcVisibilityOfTasksDeleteButton(): void {
        this._isTasksDeleteButtonVisible = this._tasksTableModel
            .data.some((value: IMdlTableModelItem) => value.selected);
    }


    // MachineTasks area
    private emptyNewMachineTask(): void {
        this._newMachineTask.machine = '';
        this._newMachineTask.task = '';
        this._newMachineTask.time = '';
    }
    private addNewMachineTask(): void {
        if (!this.validateNewMachineTask())
            return;

        this._machineTasksTableModel.data.push(this._newMachineTask.copy());

        this.emptyNewMachineTask();

        this._answer = null;
    }
    private validateNewMachineTask(): boolean {
        if (typeof (this._newMachineTask.machine) === 'undefined' || this._newMachineTask.machine === '') {
            this._dialogService.alert("Исполнитель не указан!", "Ок", "Ошибка");
            return false;
        }

        if (typeof (this._newMachineTask.task) === 'undefined' || this._newMachineTask.task === '') {
            this._dialogService.alert("Работа не указана!", "Ок", "Ошибка");
            return false;
        }

        if (typeof (this._newMachineTask.time) === 'undefined' || this._newMachineTask.time.trim() === '') {
            this._dialogService.alert("Не задано время выполнения!", "Ок", "Ошибка");
            return false;
        }

        let time: number = +this._newMachineTask.time;
        if (isNaN(time) || time <= 0) {
            this._dialogService.alert("Поле 'время' должно быть положительным числом отличным от 0!", "Ок", "Ошибка");
            return false;
        }

        return true;
    }
    private deleteSelectedMachineTasks(): void {
        // Get all selected machines
        let selectedMachineTasks = this._machineTasksTableModel.data.filter(value => value.selected);

        // Delete selected machines
        for (let machineTask of selectedMachineTasks)
            Arrays.remove(this._machineTasksTableModel.data, machineTask);

        this.recalcVisibilityOfMachineTasksDeleteButton();

        this._answer = null;
    }
    private machineTasksTableSelectionChanged(event: any): void {
        this.recalcVisibilityOfMachineTasksDeleteButton();
    }
    private recalcVisibilityOfMachineTasksDeleteButton(): void {
        this._isMachineTasksDeleteButtonVisible = this._machineTasksTableModel
            .data.some((value: IMdlTableModelItem) => value.selected);
    }
    private getDataForTaskSelector(): IMdlTableModelItem[] {
        return this._tasksTableModel.data.filter((task: TableTask) =>
            !this._machineTasksTableModel.data.some((mt: TableMachineTask) =>
                mt.machine === this._newMachineTask.machine && mt.task === task.name));
    } 
    
    // Table area
    private getTimeForMachineAndTask(machine: string, task: string): number {
        let machineTask = this._machineTasksTableModel.data.find((value: TableMachineTask) => {
            return value.machine === machine && value.task === task;
        });

        if (machineTask)
            return +(machineTask as TableMachineTask).time;

        return 0;
    }
    //// Condition area end


    //// Calc area
    private calcAnswerUseStupidMethod(): void {
        this._answer = null;
        try {
            let machines = new Dictionary<string, Machine>();
            this._machinesTableModel.data.forEach((value: TableMachine) => {
                machines.setValue(value.name, new Machine(value.name));
            });

            let tasks = new Dictionary<string, Task>();
            this._tasksTableModel.data.forEach((task: TableTask) => {
                let t = new Task(task.name);
                machines.forEach((key, machine) => {
                    let machineTask = this._machineTasksTableModel.data.find((mt: TableMachineTask) => {
                        return mt.machine === key && mt.task === task.name;
                    });

                    if (machineTask)
                        t.setTime(machine, +(machineTask as TableMachineTask).time);
                    else
                        t.setTime(machine, 0);
                });
                tasks.setValue(task.name, t);
            });

            this._answer = this._taskSolver.SolveStupid(tasks.values(), machines.values());
            this._dialogService.alert("Решение получено!", "Ок", "Успех");
        }
        catch (error) {
            this._dialogService.alert(error, "Ок", "Ошибка");
        }
    }
    private calcAnswerUseHeuristicMethod(): void {
        this._answer = null;
        try {
            let machines = new Dictionary<string, Machine>();
            this._machinesTableModel.data.forEach((value: TableMachine) => {
                machines.setValue(value.name, new Machine(value.name));
            });

            let tasks = new Dictionary<string, Task>();
            this._tasksTableModel.data.forEach((task: TableTask) => {
                let t = new Task(task.name);
                machines.forEach((key, machine) => {
                    let machineTask = this._machineTasksTableModel.data.find((mt: TableMachineTask) => {
                        return mt.machine === key && mt.task === task.name;
                    });

                    if (machineTask)
                        t.setTime(machine, +(machineTask as TableMachineTask).time);
                    else
                        t.setTime(machine, 0);
                });
                tasks.setValue(task.name, t);
            });

            this._answer = this._taskSolver.SolveHeuristic(tasks.values(), machines.values());
            this._dialogService.alert("Решение получено!", "Ок", "Успех");
        }
        catch (error) {
            this._dialogService.alert(error, "Ок", "Ошибка");
        }
    }
    //// Calc area end
}
