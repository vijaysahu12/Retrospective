import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate, query, stagger, keyframes } from '@angular/animations';
import { RetrospectiveService } from '../../Service/retrospective.service';
import { RetroType, RetrospectiveModel } from '../../Modals/Retrospective.model';
import { HubConnectionService } from 'src/app/Service/hub-connection.service';

@Component({
  selector: 'app-retrospective',
  templateUrl: './retrospective.component.html',
  styleUrls: ['./retrospective.component.css'],
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
export class RetrospectiveComponent implements OnInit {
  colorCodeIs: 'red';
  textAreaValue = '';
  textEditorForWell = false;
  textEditorForWrong = false;
  currentAction: RetroType;
  retroType = RetroType;
  RetroCommentsList: RetrospectiveModel[] = [];


  constructor(private retroService: RetrospectiveService, private hubConnection: HubConnectionService) { }

  ngOnInit() {
    // this.sendMessage();
    this.retroService.GetRetroCommentList(1).subscribe(x => {
      console.log('Got Comments from APi');
      this.RetroCommentsList = x;
    });

    this.hubConnection.dataReceived.subscribe(msg => {
      console.log('Got Comments from HUB');

      if (msg.action === 'd') {
        this.RetroCommentsList = this.RetroCommentsList.filter( x => x.token !== msg.token);
      } else if (this.RetroCommentsList.filter(item => item.token === msg.token)[0]) {
        const rr = this.RetroCommentsList.filter(item => item.token === msg.token)[0];
        rr.type = msg.type;
        rr.voteUp = msg.voteUp;
        rr.voteDown = msg.voteDown;

        this.RetroCommentsList = this.RetroCommentsList;
      } else {
        this.RetroCommentsList = this.RetroCommentsList.concat(msg);
      }
    });
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
        sprintId: 1,
        createdBy: 1,
        editable: true,
        type: retType,
        voteDown: 0,
        voteUp: 0,
        action : '',
        colorCode: this.retroService.GetColorForCardRandom()
      };
      this.hubConnection.SendMessage(dd);
      this.textAreaValue = '';
    }
    this.hideShowTextEditor();
  }

  toggle() {
    this.textEditorForWrong = false;
    this.textEditorForWell = false;
  }



  onRetroItemClick(item: number) {
    const dd = this.RetroCommentsList.filter(x => x.commentId === item)[0];
    if (dd.type === RetroType.well) {

    } else if (dd.type === RetroType.wrong) {
    }
  }

  ConvertDivToText(event: any, RetroId: number) {

    const retroObj = this.RetroCommentsList.filter(x => x.commentId === RetroId)[0];
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
        this.hubConnection.SendMessage(tempComment);
      }
      (ev.currentTarget as HTMLInputElement).focus();
    });
  }

  allowDrop(ev) {
    console.log('allowDrop');
    ev.preventDefault();
  }

  drag(ev, commentId) {
    console.log('drag');
    ev.dataTransfer.setData('commentId', ev.target.id);
    ev.dataTransfer.setData('commentMessage', ev.target.innerHTML);
  }

  drop(ev, retroType: RetroType) {
    console.log('drop');
    ev.preventDefault();
    const data = ev.dataTransfer.getData('commentId');
    ev.target.appendChild(document.getElementById(data));
    this.updateRetroType(parseInt(data, 0), retroType);
  }

  updateRetroType(commentId: number, retroType: RetroType) {
    console.log('updateRetroType called');
    const tempComment = this.RetroCommentsList.filter(x => x.commentId === commentId)[0];
    tempComment.type = retroType;
    this.hubConnection.SendMessage(tempComment);
  }

  deleteRetroPoint(event, commentId) {
    const tempComment = this.RetroCommentsList.filter(x => x.commentId === commentId)[0];
    tempComment.action = 'd';
    this.hubConnection.SendMessage(tempComment);
  }
  GivenOneLike(event, commentId) {
    console.log('updateRetroType called');
    const tempComment = this.RetroCommentsList.filter(x => x.commentId === commentId)[0];
    tempComment.voteUp = tempComment.voteUp + 1;
    this.hubConnection.SendMessage(tempComment);
  }
  notAllowDrop(ev) {
    ev.preventDefault();
  }
}


// <h2>Drag and Drop</h2>
// <div id="div1" (drop)="drop($event)" (dragover)="allowDrop($event)">

//   <img src="https://images.pexels.com/photos/658687/pexels-photo-658687.jpeg?auto=compress&cs=tinysrgb&h=350"
//     draggable="true" (dragstart)="drag($event)" id="drag1" width="88" height="31">
// </div>

// <div id="div2" (drop)="drop($event)" (dragover)="allowDrop($event)">
// </div>
