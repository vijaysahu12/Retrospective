import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate, query, stagger, keyframes } from '@angular/animations';
import { RetrospectiveService } from '../../Service/retrospective.service';
import { RetroType, RetrospectiveModel, ActiveUser, RetroSprintModal } from '../../Modals/Retrospective.model';
import { HubConnectionService } from 'src/app/Service/hub-connection.service';
import { DatePipe } from '@angular/common';
import { SSL_OP_ALL } from 'constants';

@Component({
  selector: 'app-retrospective',
  templateUrl: './retrospective.component.html',
  styleUrls: ['./retrospective.component.css'] ,
  animations: [
    trigger('shrinkOut', [
      transition('* => *', [ // each time the binding value changes
        query(':leave', [
          stagger(600, [
            animate('1.5s', style({ opacity: 0 }))
          ])
        ], { optional: true }),
        query(':enter', [
          style({ opacity: 0 }),
          stagger(600, [
            animate('1.5s', style({ opacity: 1 }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('filterAnimation', [
      state('in', style({})),
      transition('* => void', [
        style({ height: '!', opacity: 1 }),
        animate(200, style({ height: 0, opacity: 0 }))
      ]),
      transition('void => *', [
        style({ height: 0, opacity: 0 }),
        animate(400, style({ height: '*', opacity: 1 }))
      ])
    ]),

    trigger('listAnimation', [
      transition(':enter, * => 0, * => -1', []),
      transition(':increment', [
        query(':enter', [
          style({ opacity: 0, width: '0px' }),
          stagger(50, [
            animate('300ms ease-out', style({ opacity: 1, width: '*' })),
          ]),
        ], { optional: true })
      ]),
      transition(':decrement', [
        query(':leave', [
          stagger(50, [
            animate('300ms ease-out', style({ opacity: 0, width: '0px' })),
          ]),
        ], { optional: true })
      ]),
    ])

  ]
})
export class RetrospectiveComponent implements OnInit , OnDestroy {
  retroStarted = false;

  darkMode: boolean;
  textAreaValue = '';
  textEditorForWell = false;
  textEditorForWrong = false;
  currentAction: RetroType;
  retroType = RetroType;
  RetroCommentsList: RetrospectiveModel[] = [];
  userName = 'vijay';
  startRetroSprint: RetroSprintModal = {
    ProjectName: '',
    SprintToken: ''
  };

  SprintId: number;
  activeUserList: ActiveUser[] = [];

  constructor(private retroService: RetrospectiveService, private hubConnection: HubConnectionService , private datePipe: DatePipe) { }

  ngOnInit() {

    const RetroToken = localStorage.getItem('retroStarted.SprintName');
    const ExpiryDate = localStorage.getItem('retroStarted.ExpiryDate');
    if (RetroToken === null || this.datePipe.transform(new Date(ExpiryDate).getTime() , 'yyyy-MM-dd' ) <
    this.datePipe.transform( new Date().getTime(), 'yyyy-MM-dd' )) {
      this.retroStarted = false;
    } else {
     this.GetRetroCommentList(RetroToken);
    }

    this.hubConnection.dataReceived.subscribe(msg => {
      console.log('Got retro comments from HUB');
      if (msg !== null && msg.token !== '') {
        if (msg.action === 'd') {
          this.RetroCommentsList = this.RetroCommentsList.filter(x => x.token !== msg.token);
        } else if (this.RetroCommentsList.filter(item => item.token === msg.token)[0]) {
          const rr = this.RetroCommentsList.filter(item => item.token === msg.token)[0];
          rr.type = msg.type;
          rr.voteUp = msg.voteUp;
          rr.voteDown = msg.voteDown;

          this.RetroCommentsList = this.RetroCommentsList;
        } else {
          this.RetroCommentsList = this.RetroCommentsList.concat(msg);
        }
      }
    });
    this.hubConnection.userReceived.subscribe(user => {
      if (this.activeUserList.filter(x => x.userName !== user).length < 0) {
        this.activeUserList.push({
          userName: user,
          profileImage: ''
        });
        this.activeUserList = this.activeUserList;
      }
    });
  }
  GetRetroCommentList(RetroToken: string) {
    console.log('SprintToken: ' + RetroToken);
    this.retroService.GetRetroCommentList(parseFloat(RetroToken)).subscribe(x => {
      console.log('Got Comments from APi');
      this.RetroCommentsList = x;
      this.retroStarted = true;
    });
  }

  ngOnDestroy() {
    localStorage.clear();
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

  onTextEnter(event, retType: RetroType) {
    if (event !== undefined && event != null && event !== '' && event.toString().trim().length > 1) {
      const dd: RetrospectiveModel = {
        commentId: 0,
        token: '',
        message: event,
        sprintId: this.SprintId,
        createdBy: 1,
        editable: true,
        type: retType,
        voteDown: 0,
        voteUp: 0,
        action: '',
        colorCode: this.retroService.GetColorForCardRandom()
      };
      this.hubConnection.SendMessage(this.userName, (dd));
      this.textAreaValue = '';
    }
    this.hideShowTextEditor();
  }

  toggle() {
    this.textEditorForWrong = false;
    this.textEditorForWell = false;
  }



  onRetroItemClick(item: string) {
    const dd = this.RetroCommentsList.filter(x => x.token === item)[0];
    if (dd.type === RetroType.well) {

    } else if (dd.type === RetroType.wrong) {
    }
  }

  ConvertDivToText(event: any, token: string) {

    const retroObj = this.RetroCommentsList.filter(x => x.token === token)[0];
    const textBox = document.createElement('textarea');
    textBox.setAttribute('id', 'attribute');
    textBox.setAttribute('data_token', retroObj.token);
    textBox.setAttribute('class', 'textEditor');
    textBox.setAttribute('rows', '5');
    textBox.setAttribute('cols', '38');

    textBox.value = retroObj.message;
    const divInfo = event.currentTarget.parentElement.previousSibling;
    divInfo.innerText = '';
    divInfo.setAttribute('display', 'none');
    divInfo.appendChild(textBox);
    textBox.focus();

    const imgRef = event.currentTarget as HTMLElement; //    divInfo.nextSibling.firstElementChild as HTMLImageElement;
    imgRef.style.display = 'none';

    textBox.addEventListener('keyup', (ev) => {
      if (ev.keyCode === 13) {
        const textRef = document.getElementById('attribute') as HTMLInputElement;
        const tokenTemp = textRef.getAttribute('data_token');
        (textRef.parentElement.nextElementSibling.getElementsByTagName('svg')[1]).style.display = 'block';
        textRef.parentElement.innerHTML = textRef.value;
        textRef.setAttribute('display', 'block');
        textRef.remove();
        const tempComment = this.RetroCommentsList.filter(x => x.token === tokenTemp)[0];
        tempComment.message = textRef.value;
        this.hubConnection.SendMessage(this.userName, tempComment);
      }
      (ev.currentTarget as HTMLInputElement).focus();
    });
  }

  allowDrop(ev) {
    console.log('allowDrop');
    ev.preventDefault();
  }

  drag(ev, token) {
    console.log('drag');
    ev.dataTransfer.setData('token', ev.target.id);
    ev.dataTransfer.setData('commentMessage', ev.target.innerHTML);
  }

  drop(ev, retroType: RetroType) {
    console.log('drop');
    ev.preventDefault();
    const data = ev.dataTransfer.getData('token');
    ev.target.appendChild(document.getElementById(data));
    this.updateRetroType(data, retroType);
  }

  updateRetroType(token: string, retroType: RetroType) {
    console.log('updateRetroType called');
    const tempComment = this.RetroCommentsList.filter(x => x.token === token)[0];
    tempComment.type = retroType;
    this.hubConnection.SendMessage(this.userName, tempComment);
  }

  deleteRetroPoint(event, token) {
    const tempComment = this.RetroCommentsList.filter(x => x.token === token)[0];
    tempComment.action = 'd';
    this.hubConnection.SendMessage(this.userName, tempComment);
  }
  GivenOneLike(event, token) {
    console.log('updateRetroType called');
    const tempComment = this.RetroCommentsList.filter(x => x.token === token)[0];
    tempComment.voteUp = tempComment.voteUp + 1;
    this.hubConnection.SendMessage(this.userName, tempComment);
  }
  notAllowDrop(ev) {
    ev.preventDefault();
  }

  onRetroStarted() {

    if (this.startRetroSprint.ProjectName === '' || this.startRetroSprint.SprintToken === '') {
      return;
    }

    this.retroStarted = true;
    localStorage.setItem('retroStarted.SprintName', this.startRetroSprint.SprintToken.toString());
    localStorage.setItem('retroStarted.ExpiryDate', new Date().toString());

    this.startRetroSprint.SprintToken = this.startRetroSprint.SprintToken.toString();
    this.retroService.AddSprint(this.startRetroSprint).subscribe(res =>{
      console.log('SprintId  : ' + res);
      this.SprintId = res;
      this.GetRetroCommentList(this.startRetroSprint.SprintToken);
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
