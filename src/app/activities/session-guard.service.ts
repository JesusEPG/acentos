import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Component, TemplateRef } from '@angular/core';

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable()
export class SessionGuard implements CanDeactivate<ComponentCanDeactivate> {

    constructor() {}

    canDeactivate(component: ComponentCanDeactivate): boolean | Observable<boolean> {
      
        //Si no hay cambios pendientes permitir abandonar la página, sino, confirmar primero

        if(component.canDeactivate()){
            return true;
        } else {

           if(confirm('ATENCIÓN: Aún no has terminado. Presiona Cancelar para seguir aquí, o Aceptar para salir.')) {
               return true;
           } else 
               return false;
        }
    }
}