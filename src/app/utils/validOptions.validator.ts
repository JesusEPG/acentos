import { FormControl } from '@angular/forms';

export function validOptionsValidator(control: FormControl) {
    let isNotValid = (control.value==="Seleccione dificultad" || control.value==="Seleccione grado");
    return isNotValid ? { 'validoptions': true } : null;
}