import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RetrospectiveDbModel, RetrospectiveModel, CardColors, RetroType } from '../Modals/Retrospective.model';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { min, max } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class RetrospectiveService implements OnInit {

  constructor(private _httpClient: HttpClient) { }
  url = 'http://localhost:63023/api/';
  addUrl: 'Retrospective';

  ngOnInit() { }

  GetRetroComment(retroModel: RetrospectiveDbModel) {
    let paramObj: HttpParams;
    paramObj.append('RetroId', retroModel.RetroId.toString());
    return this._httpClient.get('url', { params: paramObj });
  }

  GetRetroCommentList(sprintId: number): Observable<RetrospectiveModel[]> {
    return this._httpClient.get<RetrospectiveModel[]>(this.url + 'Retrospective', { params: new HttpParams().set('id', sprintId.toString()) });
  }

  AddRetroComment(retroModel: RetrospectiveModel): Observable<boolean> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };

    console.log(retroModel.message);
    const urlis = this.url + 'Retrospective'; // this.addUrl;
    return this._httpClient.post<boolean>(urlis, retroModel, httpOptions); // .pipe(catchError(this.handleError));
  }

  UpdateRetroComment(retroModel: RetrospectiveDbModel) {
    let paramObj: HttpParams;
    paramObj.append('RetroId', retroModel.RetroId.toString());
    paramObj.append('Message', retroModel.Message.toString());
    return this._httpClient.get('url', { params: paramObj });
  }

  DeleteRetroComment(retroModel: RetrospectiveDbModel) {
    let paramObj: HttpParams;
    paramObj.append('RetroId', retroModel.RetroId.toString());
    return this._httpClient.get('url', { params: paramObj });
  }
  GetCommentList(): RetrospectiveModel[] {
    // this.retroService.GetRetroCommentList(1).subscribe(res => {
    //   console.log(res);
    //   this.RetroCommentsList = res;

    //   this.wentWell = res.filter(x => x.Type === RetroType.well);
    //   this.wentWrong = res.filter(x => x.Type === RetroType.wrong);
    //   this.actionTaken = res.filter(x => x.Type === RetroType.action);

    // });
    const RetroCommentsList: RetrospectiveModel[] = [];
    RetroCommentsList.push({
      retroId: 1,
      colorCode: this.GetColorForCardRandom(),
      createdBy: 1,
      editable: true,
      message: 'Testing by vijay sahu',
      sprintId: 1,
      type: RetroType.wrong,
      voteDown: 0,
      voteUp: 0
    });

    RetroCommentsList.push({
      retroId: 2,
      colorCode: this.GetColorForCardRandom(),
      createdBy: 1,
      editable: true,
      message: 'Testing by sad fasd fasdf asd fasd f sahu',
      sprintId: 1,
      type: RetroType.well,
      voteDown: 0,
      voteUp: 0
    });

    RetroCommentsList.push({
      retroId: 3,
      colorCode: this.GetColorForCardRandom(),
      createdBy: 1,
      editable: true,
      message: ';lm omkl mk mlkmlkm lkml kml mlkm lmlk  by sad fasd fasdf asd fasd f sahu',
      sprintId: 1,
      type: RetroType.well,
      voteDown: 0,
      voteUp: 0
    });

    RetroCommentsList.push({
      retroId: 4,
      colorCode: this.GetColorForCardRandom(),
      createdBy: 1,
      editable: true,
      message: 'd sd gwtoioyoy uou pi oi poi opip ipi poi poi poi by sad fasd fasdf asd fasd f sahu',
      sprintId: 1,
      type: RetroType.well,
      voteDown: 0,
      voteUp: 0
    });
    RetroCommentsList.push({
      retroId: 5,
      colorCode: this.GetColorForCardRandom(),
      createdBy: 1,
      editable: true,
      message: 'Testing by vijay af asdfads fadsf asd fasdf sadf saf af ',
      sprintId: 1,
      type: RetroType.wrong,
      voteDown: 0,
      voteUp: 0
    });

    return RetroCommentsList;
  }

  handleError(e) {
    debugger;
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
    return '#ffff94';
    // return colors[Math.floor(Math.random() * (16 - 0)) + 0];
  }
}


