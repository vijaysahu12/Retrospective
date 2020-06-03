import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RetrospectiveModel, CardColors, RetroType, RetroSprintModal } from '../Modals/Retrospective.model';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { min, max } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class RetrospectiveService implements OnInit {

  constructor(private _httpClient: HttpClient) { }
  url = 'http://localhost:56466/api/';
  addUrl = 'Retro';

  ngOnInit() { }

  AddSprint(retroModel: RetroSprintModal): Observable<number> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    console.log(retroModel.ProjectName);
    const urlis = this.url + this.addUrl; // this.addUrl;
    return this._httpClient.post<number>(urlis, retroModel, httpOptions);
  }

  GetRetroCommentList(RetroToken: number): Observable<RetrospectiveModel[]> {
    return this._httpClient.get<RetrospectiveModel[]>(this.url + this.addUrl,
    { params: new HttpParams().set('RetroToken', RetroToken.toString()) });
  }

  GetRandomColor() {
    const randomColor: CardColors[] = [{
      ColorCode: '#faf3dd',
      ColorId: 1
    }, {
      ColorCode: '#f4acb7',
      ColorId: 2
    }, {
      ColorCode: '#74c69d',
      ColorId: 3
    }, {
      ColorCode: '#979dac',
      ColorId: 4
    }, {
      ColorCode: '#00bbf9',
      ColorId: 5
    }, {
      ColorCode: '#63b7af',
      ColorId: 6
    }];
  }
  GetColorForCardRandom() {

    const colors = ['#faf3dd', '#f4acb7', '#74c69d', '#979dac', '#00bbf9',
      '#63b7af', '#f9c74f', '#fe938c', '#16697a', '#ed6a5a', '#706677', '#9d4edd',
      '#ff5d8f', '#1b998b', '#233d4d', '#f4f482'];
    return '#BD2130';
    // return colors[Math.floor(Math.random() * (999 - 0)) + 0];
  }
}


