import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, } from 'rxjs';
import {tap, take, map } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { IOption } from '@coreui/angular-pro';
import { RemoteApiService } from '../services/remote-api.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  options$: Observable<IOption[]>;
  readonly searchValue$ = new BehaviorSubject<string>('');
  readonly loading$ = new BehaviorSubject<boolean>(true);

  formGroup = new FormGroup({
    sampleSelect: new FormControl<string[]>(['6'])
  });


  searchFn = (option: IOption, searchValue: string): boolean =>
    option.label?.toLowerCase().startsWith(searchValue.trimStart().toLowerCase()) ?? true;

    constructor(private remote: RemoteApiService, private router: Router) {
      this.options$ = this.remote.search(this.searchValue$).pipe(
        tap(() => {this.loading$.next(true);}),
        take(1),
        map(next => {
          return next.map(option => {
            const value = option.id.toString().trim();
            const label = option.last_name;
            const text = `${option.last_name} [${value}]`;
            const disabled = option.id === '6';
            return { value, label, text, disabled };
          });
        }),
        tap(() => {this.loading$.next(false);}),
      );  
    }      

  navigateToDetails(){
    this.router.navigate(["details"]);
  }
}
