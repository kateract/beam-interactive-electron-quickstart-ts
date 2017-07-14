import { Component , OnInit } from '@angular/core';
import { IInteractiveHost } from '../IInteractiveHost';
import { ButtonService } from './button.service';

const ipcRenderer = require('electron').ipcRenderer;

import { IButtonData } from 'beam-interactive-node2'

@Component({
  moduleId: module.id,
  selector: 'my-app',
  templateUrl: 'app.component.html',
  providers: [ButtonService],
  styleUrls: ['./css/app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private buttonService: ButtonService) { };
  
  ngOnInit(): void { 
    this.getButtons();
  }

  buttons: IButtonData[];

  public title: string = "Mixer Interactive Electron Quickstart";
  public selectedButton: IButtonData;

  public onSelect(button: IButtonData): void {
    this.selectedButton = button;
  }

  getButtons(): void {
    this.buttonService.getButtons().then(buttons => this.buttons = buttons);
  }

  public connect() : void {
    ipcRenderer.send("InitiateInteractiveConnection");
  }


}
