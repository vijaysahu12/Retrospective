import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate, query, stagger, keyframes } from '@angular/animations';
import { RetrospectiveService } from 'src/app/Service/retrospective.service';
import { RetroType, RetrospectiveModel, RetrospectiveDbModel } from 'src/app/Modals/Retrospective.model';

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
  wentWell: RetrospectiveModel[] = [];
  wentWrong: RetrospectiveModel[] = [];
  actionTaken: RetrospectiveModel[] = [];
  retroRquestModel: RetrospectiveDbModel;
  constructor(private retroService: RetrospectiveService) { }

  ngOnInit() {
    // interval(1000).subscribe( t => this.GetCommentList());
    this.GetCommentList();
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
      if (this.currentAction === RetroType.well) {
        console.log('well ');
        this.wentWell.push({
          Message: event,
          SprintId: 1,
          CreatedBy: 1,
          Editable: true,
          Type: RetroType.well,
          VoteDown: 0,
          VoteUp: 0,
          ColorCode : this.retroService.GetColorForCardRandom()
        });

        this.AddComment(this.wentWell[this.wentWell.length - 1]);
      } else if (this.currentAction === RetroType.wrong) {
        this.wentWrong.push({
          Message: event,
          SprintId: 1,
          CreatedBy: 1,
          VoteDown: 0,
          VoteUp: 0,
          Editable: true,
          Type: RetroType.wrong,
          ColorCode : this.retroService.GetColorForCardRandom()
        });

        this.AddComment(this.wentWrong[this.wentWrong.length - 1]);
      }
      this.textAreaValue = '';
    }
    this.hideShowTextEditor();
  }

  toggle() {
    this.textEditorForWrong = false;
    this.textEditorForWell = false;
  }

  GetCommentList() {
    this.retroService.GetRetroCommentList(1).subscribe(res => {
      console.log(res);
      this.RetroCommentsList = res;

      this.wentWell = res.filter(x => x.Type === RetroType.well);
      this.wentWrong = res.filter(x => x.Type === RetroType.wrong);
      this.actionTaken = res.filter(x => x.Type === RetroType.action);

    });
  }

  getComments() {
    this.retroService.GetRetroComment(this.retroRquestModel).subscribe(res => { console.log(res); });
  }

  AddComment(retroModel: RetrospectiveModel) {
    this.retroService.AddRetroComment(retroModel).subscribe(res => { console.log(res); });
  }


  UpdateComment() {
    this.retroService.UpdateRetroComment(this.retroRquestModel).subscribe(res => { console.log(res); });
  }

  DeleteComment() {
    this.retroService.DeleteRetroComment(this.retroRquestModel).subscribe(res => { console.log(res); });
  }

}









