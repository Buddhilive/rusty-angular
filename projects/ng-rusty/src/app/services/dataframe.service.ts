import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataframeService {

  constructor() { }

  get dataframe() {
    return true;
  }
}
