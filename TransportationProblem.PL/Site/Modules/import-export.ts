import * as XLSX                from 'ts-xlsx';
import { TableVertex, TableArc, TableAnswer } from '../App/TransportationProblem/transportation-problem.component';



export class TransportationProblemExport{
    public static GetSamplesName(startCell: string) {
        var workbook = XLSX.readFile('C:\Users\Siarhei_Kananovich\Desktop\test.xlsx');
        var worksheet = workbook.Sheets[workbook.SheetNames[0]];
        var desired_cell = worksheet[startCell];
    }
}