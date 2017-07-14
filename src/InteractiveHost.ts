import { EventEmitter } from 'events';

import { 
    GameClient,
    IParticipant
} from 'beam-interactive-node2';

import { IInteractiveHost } from './IInteractiveHost'


export class InteractiveHost extends EventEmitter implements IInteractiveHost {
    public client: GameClient;
    public test: string; 

    constructor() {
        super() 
        this.test = "Hello From the InteractiveHost"
    }
}