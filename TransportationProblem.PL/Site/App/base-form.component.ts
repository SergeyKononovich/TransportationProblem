import { Component, OnInit }    from '@angular/core';

import { AlgorithmService }     from '../Services/algorithm.service';


@Component({
    selector: 'base-form-component',
    templateUrl: './base-form.component.html',
    styleUrls: ['./base-form.component.scss']
})
export class BaseFormComponent implements OnInit {

    constructor(_algService: AlgorithmService) {
    }


    ngOnInit() {
        // раскоменть говнюк
        // this._algService.МойГовноАлг(мои, говнопараметры);
        // console.log('govnodebug');
    }
}
