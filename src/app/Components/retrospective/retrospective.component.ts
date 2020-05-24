import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate, query, stagger, keyframes } from '@angular/animations';
import { RetrospectiveService } from '../../Service/retrospective.service';
import { RetroType, RetrospectiveModel, RetrospectiveDbModel } from '../../Modals/Retrospective.model';
import { HubConnectionService } from 'src/app/Service/hub-connection.service';

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

  constructor(private retroService: RetrospectiveService , private hubConnection: HubConnectionService) { }

  ngOnInit() {
    // this.sendMessage();
    this.RetroCommentsList = this.retroService.GetCommentList();
    this.hubConnection.dataReceived.subscribe(msg => {
      const ll = {
        retroId: msg.retroId,
        message: msg.message,
        sprintId: msg.sprintId,
        createdBy: msg.createdBy,
        editable: msg.editable,
        colorCode: msg.colorCode,
        type: msg.type,
        voteDown: 0,
        voteUp: 0
      };
      this.RetroCommentsList = this.RetroCommentsList.concat(ll);
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

  onTextEnter(event , retType: RetroType) {
    if (event !== undefined && event != null && event !== '' && event.toString().trim().length > 1) {
      const dd: RetrospectiveModel = {
        retroId: 0,
        message: event,
        sprintId: 1,
        createdBy: 1,
        editable: true,
        type: retType,
        voteDown: 0,
        voteUp: 0,
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

  getComments() {
    this.retroService.GetRetroComment(this.retroRquestModel).subscribe(res => { console.log(res); });
  }

  UpdateComment() {
    this.retroService.UpdateRetroComment(this.retroRquestModel).subscribe(res => { console.log(res); });
  }

  DeleteComment() {
    this.retroService.DeleteRetroComment(this.retroRquestModel).subscribe(res => { console.log(res); });
  }

  onRetroItemClick(item: number) {
    const dd = this.RetroCommentsList.filter(x => x.retroId === item)[0];
    if (dd.type === RetroType.well) {

    } else if (dd.type === RetroType.wrong) {
    }
  }

  ConvertDivToText(event: any, RetroId: number) {

    const retroObj = this.RetroCommentsList.filter(x => x.retroId === RetroId)[0];
    const textBox = document.createElement('textarea');
    textBox.setAttribute('id', 'attribute');
    textBox.setAttribute('class', 'textEditor');
    textBox.setAttribute('rows', '5');
    textBox.setAttribute('cols', '38');

    textBox.value = retroObj.message;
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
}


// <h2>Drag and Drop</h2>
// <div id="div1" (drop)="drop($event)" (dragover)="allowDrop($event)">

//   <img src="https://images.pexels.com/photos/658687/pexels-photo-658687.jpeg?auto=compress&cs=tinysrgb&h=350"
//     draggable="true" (dragstart)="drag($event)" id="drag1" width="88" height="31">
// </div>

// <div id="div2" (drop)="drop($event)" (dragover)="allowDrop($event)">
// </div>
