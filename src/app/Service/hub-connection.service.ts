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
   
    this.connection
      .invoke(this.hubMethodName, 'vj', msg).finally()
      .catch(err => console.log(err));
  }
  AddComment(retroModel: RetrospectiveModel) {
    this.connection.send('newMessage', '', retroModel)
      .then(() => console.log('msg send'));
    // this.AddRetroComment(retroModel).subscribe(res => { console.log(res); });
  }
}



// GO
// /****** Object:  StoredProcedure [dbo].[uspRetroAddorUPpdate]    Script Date: 25-05-2020 20:23:06 ******/
// SET ANSI_NULLS ON
// GO
// SET QUOTED_IDENTIFIER ON
// GO
// --select * From RetroCOmments
// -----------------------------------------------------------------
// --exec [uspRetroAddorUPpdate] 1 , '22 Test from stored proecedure', 1, '#red' , 1, 1, 0 
// ALTER PROCEDURE [dbo].[uspRetroAddorUPpdate] 
// 	@RetroCommentId int,
// 	@SprintId INT,
// 	@Message NVARCHAR(500),
// 	@CreatedBy INT,
// 	@ColorCode NVARCHAR(15),
// 	@Type INT,
// 	@VoteDown INT ,
// 	@VoteUp INT,
// 	@actionToTaken varchar(10)

// AS 
// BEGIN

// 	IF(isnull(@actionToTaken,'') = 'd')
// 	BEGIN 
// 		DELETE FROM RetroComments where SprintID = @SprintId AND RetroCommentId = @RetroCommentId
// 	END

// 	ELSE BEGIN
// 		IF EXISTS ( SELECT top 1 1 FROM RetroComments WHERE RetroCommentId = @RetroCommentId AND SprintId = @SprintId) 
// 		BEGIN
// 			UPDATE RetroComments 
// 			set 
// 				Message = @Message,
// 				ColorCode = @ColorCode,
// 				VoteUp = @VoteUp,
// 				VoteDown = @VoteDown,
// 				[Type] = @Type
// 			WHERE SprintId = @SprintId
// 			AND RetroCommentId = @RetroCommentId
// 		END
// 		ELSE BEGIN
// 			INSERT INTO RetroComments values (@Message, @SprintId , 1,@CreatedBy ,@ColorCode ,@Type , @VoteDown  , @VoteUp  )
// 		end
// 	end
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



// -- exec uspRetroGet 1
// CREATE PROCEDURE uspRetroGet
// @SprintId int
// AS
// BEGIN
// 	select * From RetroCOmments where Sprintid = @SprintId
// END
