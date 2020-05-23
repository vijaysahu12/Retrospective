import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate, query, stagger, keyframes } from '@angular/animations';
import { RetrospectiveService } from '../../Service/retrospective.service';
import { RetroType, RetrospectiveModel, RetrospectiveDbModel } from '../../Modals/Retrospective.model';
import * as signalR from '@microsoft/signalr';
@Component({
  selector: 'app-retrospective',
  templateUrl: './retrospective.component.html',
  styleUrls: ['./retrospective.component.css'],
  animations: [
    trigger('shrinkOut', [
      state('in', style({ height: '*' })),
      transition('* => void', [
        style({ height: '*' }),
        animate(250, style({ height: 0 }))
      ])
    ]),
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(800)),
    ]),
    trigger('EnterLeave', [
      state('flyIn', style({ transform: 'translateX(0)' })),
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('0.5s 300ms ease-in')
      ]),
      transition(':leave', [
        animate('0.3s ease-out', style({ transform: 'translateX(100%)' }))
      ])
    ]),
    trigger('items', [
      transition(':enter', [
        style({ transform: 'scale(0.5)', opacity: 0 }),  // initial
        animate('1s cubic-bezier(.8, -0.6, 0.2, 1.5)',
          style({ transform: 'scale(1)', opacity: 1 }))  // final
      ])
    ]),
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', style({ opacity: 0 }), { optional: true }),

        query(':enter', stagger('300ms', [
          animate('1s ease-in', keyframes([
            style({ opacity: 0, transform: 'translateY(-75%)', offset: 0 }),
            style({ opacity: .5, transform: 'translateY(35px)', offset: 0.3 }),
            style({ opacity: 1, transform: 'translateY(0)', offset: 1.0 }),
          ]))]), { optional: true })
      ])
    ])
  ]
})
export class RetrospectiveComponent implements OnInit {
  colorCodeIs: 'red';
  textAreaValue = '';
  textEditorForWell = false;
  textEditorForWrong = false;
  currentAction: RetroType;
  retroType = RetroType;
  RetroCommentsList: RetrospectiveModel[] = [];
  retroRquestModel: RetrospectiveDbModel;
  connection: signalR.HubConnection;
  hubMethodName = 'newMessage';
  MessageReceiver = 'messageReceived';
  singalRUrl = 'https://localhost:44338/chat';

  constructor(private retroService: RetrospectiveService) { }

  ngOnInit() {
    this.GetCommentList();
    this.BuildConnection();
    this.StartConnection();
    // this.sendMessage();
  }
  BuildConnection() {
    console.log('BuildConnection() Called.');
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(this.singalRUrl)
      .withAutomaticReconnect().configureLogging(signalR.LogLevel.Information)
      .build();
  }

  StartConnection() {
    console.log('StartConnection() called');

    this.connection
      .start()
      .then(() => {
        console.log('Connection Started!');
        this.RegisterSignalEvents();
      })
      .catch(err => {
        console.log('Error while establishing a connection :( ' + err);
      });

  }

  RegisterSignalEvents() {
    console.log('RegisterSignalEvents() called');
    this.connection.on(this.MessageReceiver, (username: string, data: any) => {
      this.RetroCommentsList.push({
        RetroId: 5,
        ColorCode: data.colorCode,
        CreatedBy: 1,
        Editable: true,
        Message: data.message,
        SprintId: 1,
        Type: data.type === '1' ? RetroType.well : RetroType.wrong,
        VoteDown: 0,
        VoteUp: 0
      });

      console.log('Received Message.');
      // this.sendMessage();
    });
  }

  sendMessage(msg: RetrospectiveModel): void {
    console.log('sendMessage() Called.');
    const data = {
      Message: msg.Message,
      Type: msg.Type.toString(),
      ColorCode: msg.ColorCode
    };
    this.connection
      .invoke(this.hubMethodName, 'vj', data).finally()
      .catch(err => console.log(err));
  }

  addItem(actionType: RetroType) {
    this.currentAction = actionType;
    this.hideShowTextEditor();
  }

  hideShowTextEditor() {
    if (this.currentAction === this.retroType.well) {
      this.textEditorForWell = true;
      this.textEditorForWrong = !this.textEditorForWell;
    } else {
      this.textEditorForWrong = true;
      this.textEditorForWell = !this.textEditorForWrong;
    }
  }

  onTextEnter(event) {
    if (event !== undefined && event != null && event !== '' && event.toString().trim().length > 1) {
      this.sendMessage(this.RetroCommentsList[0]);
      console.log('well ');
      this.RetroCommentsList.push({
        RetroId: 1,
        Message: event,
        SprintId: 1,
        CreatedBy: 1,
        Editable: true,
        Type: RetroType.well,
        VoteDown: 0,
        VoteUp: 0,
        ColorCode: this.retroService.GetColorForCardRandom()
      });

      this.textAreaValue = '';
    }
    this.hideShowTextEditor();
  }

  toggle() {
    this.textEditorForWrong = false;
    this.textEditorForWell = false;
  }

  getComments() {
    this.retroService.GetRetroComment(this.retroRquestModel).subscribe(res => { console.log(res); });
  }

  AddComment(retroModel: RetrospectiveModel) {
    this.connection.send('newMessage', '', retroModel.Message)
      .then(() => console.log('msg send'));
    this.retroService.AddRetroComment(retroModel).subscribe(res => { console.log(res); });
  }

  UpdateComment() {
    this.retroService.UpdateRetroComment(this.retroRquestModel).subscribe(res => { console.log(res); });
  }

  DeleteComment() {
    this.retroService.DeleteRetroComment(this.retroRquestModel).subscribe(res => { console.log(res); });
  }

  onRetroItemClick(item: number) {
    const dd = this.RetroCommentsList.filter(x => x.RetroId === item)[0];
    if (dd.Type === RetroType.well) {

    } else if (dd.Type === RetroType.wrong) {
    }
  }

  ConvertDivToText(event: any, RetroId: number) {

    const retroObj = this.RetroCommentsList.filter(x => x.RetroId === RetroId)[0];
    const textBox = document.createElement('textarea');
    textBox.setAttribute('id', 'attribute');
    textBox.setAttribute('class', 'textEditor');
    textBox.setAttribute('rows', '5');
    textBox.setAttribute('cols', '38');

    textBox.value = retroObj.Message;
    const divInfo = event.currentTarget.parentElement.previousSibling;
    divInfo.innerText = '';
    divInfo.setAttribute('display', 'none');
    divInfo.appendChild(textBox);
    textBox.focus();

    const imgRef = divInfo.nextSibling.firstElementChild as HTMLImageElement;
    imgRef.style.visibility = 'hidden';

    textBox.addEventListener('keyup', (ev) => {
      // if (ev.srcElement.getAttribute('class') === 'plusIcon') {
      //   //event handling code
      // }

      // Number 13 is the "Enter" key on the keyboard
      // tslint:disable-next-line: deprecation
      if (ev.keyCode === 13) {
        const textRef = document.getElementById('attribute') as HTMLInputElement;
        const imgRefShow = textRef.parentElement.nextSibling as HTMLImageElement;
        imgRefShow.getElementsByTagName('img')[0].style.visibility = 'visible';
        textRef.parentElement.innerHTML = textRef.value;
        textRef.setAttribute('display', 'block');
        textRef.remove();
      }
    });
  }

  allowDrop(ev) {
    console.log('allowDrop');
    ev.preventDefault();
  }

  drag(ev) {
    console.log('drag');

    ev.dataTransfer.setData('text', ev.target.id);
  }

  drop(ev) {
    console.log('drop');
    ev.preventDefault();
    const data = ev.dataTransfer.getData('text');
    ev.target.appendChild(document.getElementById(data));
  }
  notAllowDrop(ev) {
    ev.preventDefault();
  }
  GetCommentList() {


    // this.retroService.GetRetroCommentList(1).subscribe(res => {
    //   console.log(res);
    //   this.RetroCommentsList = res;

    //   this.wentWell = res.filter(x => x.Type === RetroType.well);
    //   this.wentWrong = res.filter(x => x.Type === RetroType.wrong);
    //   this.actionTaken = res.filter(x => x.Type === RetroType.action);

    // });

    this.RetroCommentsList.push({
      RetroId: 1,
      ColorCode: this.retroService.GetColorForCardRandom(),
      CreatedBy: 1,
      Editable: true,
      Message: 'Testing by vijay sahu',
      SprintId: 1,
      Type: RetroType.wrong,
      VoteDown: 0,
      VoteUp: 0
    });

    this.RetroCommentsList.push({
      RetroId: 2,
      ColorCode: this.retroService.GetColorForCardRandom(),
      CreatedBy: 1,
      Editable: true,
      Message: 'Testing by sad fasd fasdf asd fasd f sahu',
      SprintId: 1,
      Type: RetroType.well,
      VoteDown: 0,
      VoteUp: 0
    });

    this.RetroCommentsList.push({
      RetroId: 3,
      ColorCode: this.retroService.GetColorForCardRandom(),
      CreatedBy: 1,
      Editable: true,
      Message: ';lm omkl mk mlkmlkm lkml kml mlkm lmlk  by sad fasd fasdf asd fasd f sahu',
      SprintId: 1,
      Type: RetroType.well,
      VoteDown: 0,
      VoteUp: 0
    });

    this.RetroCommentsList.push({
      RetroId: 4,
      ColorCode: this.retroService.GetColorForCardRandom(),
      CreatedBy: 1,
      Editable: true,
      Message: 'd sd gwtoioyoy uou pi oi poi opip ipi poi poi poi by sad fasd fasdf asd fasd f sahu',
      SprintId: 1,
      Type: RetroType.well,
      VoteDown: 0,
      VoteUp: 0
    });
    this.RetroCommentsList.push({
      RetroId: 5,
      ColorCode: this.retroService.GetColorForCardRandom(),
      CreatedBy: 1,
      Editable: true,
      Message: 'Testing by vijay af asdfads fadsf asd fasdf sadf saf af ',
      SprintId: 1,
      Type: RetroType.wrong,
      VoteDown: 0,
      VoteUp: 0
    });
  }
}


// <h2>Drag and Drop</h2>
// <div id="div1" (drop)="drop($event)" (dragover)="allowDrop($event)">

//   <img src="https://images.pexels.com/photos/658687/pexels-photo-658687.jpeg?auto=compress&cs=tinysrgb&h=350"
//     draggable="true" (dragstart)="drag($event)" id="drag1" width="88" height="31">
// </div>

// <div id="div2" (drop)="drop($event)" (dragover)="allowDrop($event)">
// </div>
