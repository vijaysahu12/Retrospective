import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RetrospectiveDbModel, RetrospectiveModel } from '../Modals/Retrospective.model';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RetrospectiveService implements OnInit {

  constructor(private _httpClient: HttpClient) { }
  url = 'http://localhost:63023/api/';
  addUrl: 'Retrospective';

  ngOnInit() {}

  GetRetroComment(retroModel: RetrospectiveDbModel) {
    let paramObj: HttpParams;
    paramObj.append('RetroId', retroModel.RetroId.toString());
    return this._httpClient.get('url', {params: paramObj} );
  }

  GetRetroCommentList(sprintId: number): Observable<RetrospectiveModel[]> {
    return this._httpClient.get<RetrospectiveModel[]>(this.url + 'Retrospective', {params: new HttpParams().set('id', sprintId.toString())} );
  }

  AddRetroComment(retroModel: RetrospectiveModel): Observable<boolean> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };

    console.log(retroModel.Message);
    const urlis = this.url + 'Retrospective'; // this.addUrl;
    debugger;
    return this._httpClient.post<boolean>(urlis, retroModel , httpOptions ); // .pipe(catchError(this.handleError));
  }

  UpdateRetroComment(retroModel: RetrospectiveDbModel) {
    let paramObj: HttpParams;
    paramObj.append('RetroId', retroModel.RetroId.toString());
    paramObj.append('Message', retroModel.Message.toString());
    return this._httpClient.get('url', {params: paramObj} );
  }

  DeleteRetroComment(retroModel: RetrospectiveDbModel) {
    let paramObj: HttpParams;
    paramObj.append('RetroId', retroModel.RetroId.toString());
    return this._httpClient.get('url', {params: paramObj} );
  }


  handleError(e) {

    debugger;
  }
}
