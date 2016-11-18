import * as XLSX    from 'ts-xlsx';
import { TableVertex, TableArc, TableAnswer } from '../App/TransportationProblem/transportation-problem.component';



export class TransportationProblemExport{
    public static GetSamplesName(data: any, startCell: string) {

        var workbook = XLSX.read(data);
        var worksheet = workbook.Sheets[workbook.SheetNames[0]];
        var desired_cell = worksheet[startCell];
        desired_cell = worksheet[startCell];
    }
}