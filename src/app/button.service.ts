import { Injectable } from '@angular/core'; 
import { IButtonData } from 'beam-interactive-node2';

import { BUTTONS } from './mock-buttons';

@Injectable() 
export class ButtonService {
    getButtons(): Promise<IButtonData[]> {
        return Promise.resolve(BUTTONS);
    } 
}