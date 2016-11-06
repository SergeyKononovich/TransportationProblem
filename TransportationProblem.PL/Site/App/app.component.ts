import { Component, OnInit, ViewEncapsulation, ViewContainerRef }    from '@angular/core';
import { MdlDialogOutletService } from 'angular2-mdl';


interface MenuItem {
    title: string;
    routerLink: string;
}

@Component({
    selector: 'app-component',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
    menuItems: MenuItem[];


    constructor(private dialogService: MdlDialogOutletService, private vcRef: ViewContainerRef) {
        dialogService.setDefaultViewContainerRef(vcRef);
    }


    ngOnInit() {
        this.menuItems = [
            {
                title: "Транспортная задача",
                routerLink: "/TransportationProblem"
            },
            {
                title: "Чет ещё",
                routerLink: "/Чет ещё"
            }
        ];
    }
}
