import { EventEmitter } from 'events';
import { 
    GameClient,
    IParticipant
} from 'beam-interactive-node2';

export interface IInteractiveHost extends EventEmitter {
    client : GameClient;
    test : string;
}