import { Component, Input } from '@angular/core';
import { IButtonData } from 'beam-interactive-node2';

@Component({
    selector: 'button-detail',
    template: `
    <div *ngIf="button">
        <h2>{{button.text}} details!</h2>
        <div><label>controlID: </label> {{button.controlID}}</div>
        <div>
            <label>text: </label>
            <input [(ngModel)]="button.text" placeholder="button_text" />
        </div>
    </div>
    `,
    styleUrls: ['./app/css/button-detail.component.css']
    
})
export class ButtonDetailComponent {
    @Input() button: IButtonData;
}