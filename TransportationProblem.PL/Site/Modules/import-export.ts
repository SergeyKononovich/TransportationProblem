//import { IWorkBook, IWorkSheet, IWorkSheetCell, read as xlsxRead, utils as xlsxUtils }   from 'ts-xlsx';
import { TableVertex, TableArc, TableAnswer } from '../App/TransportationProblem/transportation-problem.component';

var XLSX = require('ts-xlsx');

type CellType = { row: number, column: string };

export class TransportationProblemSample {
    name: string;
    verts: TableVertex[];
    arcs: TableArc[];
}

export class ExcelTransportationProblemExport {

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

        //if (typeof (this._newVertex.name) === 'undefined')
        //    throw 
        let a = XLSX.utils.encode_cell({ c: 1, r: 1 });
        let sampleNameCell = worksheet[startCell];
        let startCellColumnRowNames = this.GetRowColumn(startCell);
        while (typeof (sampleNameCell) !== 'undefined') {
            let sample = new TransportationProblemSample();
            sample.name = worksheet[startCell].v;

            let cell: CellType = {
                row: startCellColumnRowNames.row,
                column: startCellColumnRowNames.column
            };
            
        }

        return samples;
    }

    private GetRowColumn(name: string): CellType {
        let firstNumber = name.search('[0-9]');
        return { row: +name.substring(firstNumber), column: name.substring(0, firstNumber) };
    }
}