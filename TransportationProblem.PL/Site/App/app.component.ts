import { Component, OnInit, ViewEncapsulation }    from '@angular/core';


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


    ngOnInit() {
        this.menuItems = [
            {
                title: "BaseForm",
                routerLink: "/BaseForm"
            },
            {
                title: "NetworkForm",
                routerLink: "/NetworkForm"
            }
        ];
    }
}
