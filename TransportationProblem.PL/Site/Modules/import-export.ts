import { TableVertex, TableArc, TableAnswer } from '../App/TransportationProblem/transportation-problem.component';
import { TableMachine, TableTask, TableMachineTask } from '../App/JohnsonSchedulingProblem/johnson-scheduling-problem.component';

import * as XLSX from 'xlsx';

type CellType = { r: number, c: number };


export class TransportationProblemSample {
    name: string;
    verts: TableVertex[] = [];
    arcs: TableArc[] = [];
}

export class JohnsonSchedulingProblemSample {
    name: string;
    machines: TableMachine[] = [];
    tasks: TableTask[] = [];
    machinesTasks: TableMachineTask[] = [];
}

export class ExcelTransportationProblemImport {

    private _workbook: any = null;


    public constructor(data: any) {
        this._workbook = XLSX.read(data, { type: 'binary' });
    }

    public GetSheetsNames(): string[] {

        return this._workbook.SheetNames;
    }

    public GetSamples(sheetName: string, startCell: string): TransportationProblemSample[] {

        let samples: TransportationProblemSample[] = [];
        let worksheet = this._workbook.Sheets[sheetName];
        
        try {
            let sampleCell: CellType = XLSX.utils.decode_cell(startCell);
            let sampleIndx = 0;
            sampleCell.r -= 8;
            while (true) {
                let sample = new TransportationProblemSample();
                sampleCell.r += 8;
                let cell = worksheet[XLSX.utils.encode_cell(sampleCell)]

                if (typeof (cell) === 'undefined')
                    break;

                // get samples name
                sample.name = cell.v;

                // get samples vertices
                let vertexCell: CellType = {
                    r: sampleCell.r + 1,
                    c: sampleCell.c + 1
                };
                while (true) {
                    let vertex = new TableVertex();

                    // get vertex name
                    vertexCell.c += 1;
                    let vCell = worksheet[XLSX.utils.encode_cell(vertexCell)]
                    if (typeof (vCell) === 'undefined' || vCell.t !== 's')
                        break;
                    vertex.name = vCell.v;
                    
                    // get vertex power
                    vertexCell.r += 1;
                    vCell = worksheet[XLSX.utils.encode_cell(vertexCell)]
                    if (typeof (vCell) === 'undefined' || vCell.t !== 'n')
                        break;
                    vertex.power = vCell.v;
                    
                    // get vertex priority
                    vertexCell.r += 1;
                    vCell = worksheet[XLSX.utils.encode_cell(vertexCell)]
                    if (typeof (vCell) === 'undefined' || vCell.t !== 's')
                        break;
                    vertex.priority = vCell.v === 'есть';

                    vertexCell.r -= 2;
                    sample.verts.push(vertex);
                }

                // get samples arcs
                let arcCell: CellType = {
                    r: sampleCell.r + 5,
                    c: sampleCell.c + 1
                };
                while (true) {
                    let arc = new TableArc();

                    // get arc source
                    arcCell.c += 1;
                    let aCell = worksheet[XLSX.utils.encode_cell(arcCell)]
                    if (typeof (aCell) === 'undefined' || aCell.t !== 's')
                        break;
                    arc.source = aCell.v;

                    // get arc slink
                    arcCell.r += 1;
                    aCell = worksheet[XLSX.utils.encode_cell(arcCell)]
                    if (typeof (aCell) === 'undefined' || aCell.t !== 's')
                        break;
                    arc.slink = aCell.v;

                    // get arc rate
                    arcCell.r += 1;
                    aCell = worksheet[XLSX.utils.encode_cell(arcCell)]
                    if (typeof (aCell) === 'undefined' || aCell.t !== 'n')
                        break;
                    arc.rate = aCell.v;

                    arcCell.r -= 2;
                    sample.arcs.push(arc);
                }

                // add parsed sample to result
                sampleIndx += 1;
                if (sample.verts.length > 0)
                    samples.push(sample);
            }
        } catch(e) {
            return samples;
        }

        return samples;
    }
}

export class ExcelJohnsonSchedulingProblemImport {

    private _workbook: any = null;


    public constructor(data: any) {
        this._workbook = XLSX.read(data, { type: 'binary' });
    }

    public GetSheetsNames(): string[] {

        return this._workbook.SheetNames;
    }

    public GetSamples(sheetName: string, startCell: string): JohnsonSchedulingProblemSample[] {

        let samples: JohnsonSchedulingProblemSample[] = [];
        let worksheet = this._workbook.Sheets[sheetName];

        try {
            let sampleCell: CellType = XLSX.utils.decode_cell(startCell);
            let sampleIndx = 0;
            sampleCell.r -= 8;
            while (true) {
                let sample = new JohnsonSchedulingProblemSample();
                sampleCell.r += 8;
                let cell = worksheet[XLSX.utils.encode_cell(sampleCell)]

                if (typeof (cell) === 'undefined')
                    break;

                // get samples name
                sample.name = cell.v;

                // get samples machines
                let machineCell: CellType = {
                    r: sampleCell.r + 1,
                    c: sampleCell.c + 1
                };
                while (true) {
                    let machine = new TableMachine();

                    // get machine name
                    machineCell.c += 1;
                    let vCell = worksheet[XLSX.utils.encode_cell(machineCell)]
                    if (typeof (vCell) === 'undefined' || vCell.t !== 's')
                        break;
                    machine.name = vCell.v;
                    
                    sample.machines.push(machine);
                }

                // get samples tasks
                let taskCell: CellType = {
                    r: sampleCell.r + 3,
                    c: sampleCell.c + 1
                };
                while (true) {
                    let task = new TableTask();

                    // get task name
                    taskCell.c += 1;
                    let vCell = worksheet[XLSX.utils.encode_cell(taskCell)]
                    if (typeof (vCell) === 'undefined' || vCell.t !== 's')
                        break;
                    task.name = vCell.v;
                    
                    sample.tasks.push(task);
                }

                // get samples arcs
                let machineTaskCell: CellType = {
                    r: sampleCell.r + 5,
                    c: sampleCell.c + 1
                };
                while (true) {
                    let machineTask = new TableMachineTask();

                    // get machinesTasks machine
                    machineTaskCell.c += 1;
                    let aCell = worksheet[XLSX.utils.encode_cell(machineTaskCell)]
                    if (typeof (aCell) === 'undefined' || aCell.t !== 's')
                        break;
                    machineTask.machine = aCell.v;

                    // get machinesTasks task
                    machineTaskCell.r += 1;
                    aCell = worksheet[XLSX.utils.encode_cell(machineTaskCell)]
                    if (typeof (aCell) === 'undefined' || aCell.t !== 's')
                        break;
                    machineTask.task = aCell.v;

                    // get machinesTasks time
                    machineTaskCell.r += 1;
                    aCell = worksheet[XLSX.utils.encode_cell(machineTaskCell)]
                    if (typeof (aCell) === 'undefined' || aCell.t !== 'n')
                        break;
                    machineTask.time = aCell.v;

                    machineTaskCell.r -= 2;
                    sample.machinesTasks.push(machineTask);
                }

                // add parsed sample to result
                sampleIndx += 1;
                if (sample.machines.length > 0)
                    samples.push(sample);
            }
        } catch (e) {
            return samples;
        }

        return samples;
    }
}

export class ExcelTransportationProblemExport {

    

    public static s2ab(s:any) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }

    public static SaveSample(sample: TransportationProblemSample): boolean {

        if (!sample)
            return false;
        

        let sheetName = 'Sheet1';
        let startCell = 'A1';
        let workbook: XLSX.IWorkBook = {
            SheetNames: [sheetName],
            Sheets: {
                [sheetName]: { }
            },
            Props: null
        };

        let worksheet = workbook.Sheets[sheetName];

        try {
            let sampleCell: CellType = XLSX.utils.decode_cell(startCell);
            let cell: XLSX.IWorkSheetCell = {
                t: 's',
                v: sample.name
            };
            worksheet[startCell] = cell;

            // get samples vertices
            let vertexCell: CellType = {
                r: sampleCell.r + 1,
                c: sampleCell.c + 1
            };
            let vertexCellName: string;
            for (let vertex of sample.verts) {
                // get vertex name
                vertexCell.c += 1;
                vertexCellName = XLSX.utils.encode_cell(vertexCell);
                let vCell: XLSX.IWorkSheetCell = {
                    t: 's',
                    v: vertex.name
                };
                worksheet[vertexCellName] = vCell;

                // get vertex power
                vertexCell.r += 1;
                vertexCellName = XLSX.utils.encode_cell(vertexCell);
                vCell = {
                    t: 'n',
                    v: vertex.power
                };
                worksheet[vertexCellName] = vCell;

                // get vertex priority
                vertexCell.r += 1;
                vertexCellName = XLSX.utils.encode_cell(vertexCell);
                vCell = {
                    t: 's',
                    v: vertex.priority ? 'есть' : 'нет'
                };
                worksheet[vertexCellName] = vCell;

                vertexCell.r -= 2;
            }

            // get samples arcs
            let arcCell: CellType = {
                r: sampleCell.r + 5,
                c: sampleCell.c + 1
            };
            let arcCellName: string;
            for (let arc of sample.arcs) {
                // get arc source
                arcCell.c += 1;
                arcCellName = XLSX.utils.encode_cell(arcCell);
                let aCell: XLSX.IWorkSheetCell = {
                    t: 's',
                    v: arc.source
                };
                worksheet[vertexCellName] = aCell;

                // get arc slink
                arcCell.r += 1;
                arcCellName = XLSX.utils.encode_cell(arcCell);
                aCell = {
                    t: 's',
                    v: arc.slink
                };
                worksheet[vertexCellName] = aCell;

                // get arc rate
                arcCell.r += 1;
                arcCellName = XLSX.utils.encode_cell(arcCell);
                aCell = {
                    t: 'n',
                    v: arc.rate
                };
                worksheet[vertexCellName] = aCell;

                arcCell.r -= 2;
            }

            let data = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });
            var blob = new Blob([ExcelTransportationProblemExport.s2ab(data)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            var url = window.URL.createObjectURL(blob);
            window.open(url);
            

        } catch (e) {
            return false;
        }

        return true;
    }
}