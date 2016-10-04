import { Component, OnInit }    from '@angular/core';

import { AlgorithmService }     from '../Services/algorithm.service';


@Component({
    selector: 'network-form-component',
    templateUrl: './network-form.component.html',
    styleUrls: ['./network-form.component.scss']
})
export class NetworkFormComponent implements OnInit {

    constructor(_algService: AlgorithmService) {
    }


    ngOnInit() {
        // раскоменть говнюк
        // this._algService.МойГовноАлг(мои, говнопараметры);
        // console.log('govnodebug');
    }
}
