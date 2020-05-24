import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import {  RetrospectiveModel } from '../Modals/Retrospective.model';

import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class HubConnectionService {
  hubMethodName = 'newMessage';
  MessageReceiver = 'messageReceived';
  singalRUrl = 'http://localhost:56466/chat';
  connection: signalR.HubConnection;
  dataReceived = new Subject<RetrospectiveModel>();
  constructor() {
    this.BuildConnection();
    this.StartConnection();
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
    this.connection.on(this.MessageReceiver, (username: string, data: RetrospectiveModel) => {
      this.dataReceived.next(data);
      console.log('Received Message.');
      // this.sendMessage();
    });
  }

  SendMessage(msg: RetrospectiveModel): void {
    console.log('sendMessage() Called.');
    const data = {
      Message: msg.message,
      Type: msg.type,
      ColorCode: msg.colorCode
    };
    this.connection
      .invoke(this.hubMethodName, 'vj', data).finally()
      .catch(err => console.log(err));
  }
  AddComment(retroModel: RetrospectiveModel) {
    this.connection.send('newMessage', '', retroModel)
      .then(() => console.log('msg send'));
    // this.AddRetroComment(retroModel).subscribe(res => { console.log(res); });
  }
}



// --exec uspRetroAdd 1 , '22 Test from stored proecedure', 1, '#red' , 1, 1, 0 
// ALTER PROCEDURE uspRetroAdd 
// 	@SprintId INT,
// 	@Message NVARCHAR(500),
// 	@CreatedBy INT,
// 	@ColorCode NVARCHAR(15),
// 	@Type INT,
// 	@VoteDown INT ,
// 	@VoteUp INT

// AS 
// BEGIN
// 	--SELECT * FROM RetroComments
// 	INSERT INTO RetroComments values (@Message, @SprintId , 1,@CreatedBy ,@ColorCode ,@Type , @VoteDown  , @VoteUp  )
// 	SELECT 1 as Result
// END


// CREATE TABLE RetroSprint(
// 	SprintId INT PRIMARY KEY IDENTITY(1,1),
// 	Description varchar(100),
// 	Token varchar(50), 
// 	CreatedDate date , 
// 	CreatedBy INT
// )

 
// CREATE TABLE RetroComments (
// 	RetroCommentId INT PRIMARY KEY IDENTITY(1 ,1), 
// 	Message NVARCHAR(500),
// 	SprintId INT,
// 	Editable BIT,
// 	CreatedBy INT,
// 	ColorCode NVARCHAR(15),
// 	Type INT,
// 	VoteDown INT ,
// 	VoteUp INT,
// 	FOREIGN KEY (SprintId) REFERENCES RetroSprint(SprintId) 
// )

