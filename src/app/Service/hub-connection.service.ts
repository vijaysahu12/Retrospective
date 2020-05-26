import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import {  RetrospectiveModel, ActiveUser } from '../Modals/Retrospective.model';

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
  userReceived = new Subject<string>();
  userName: string;
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
    this.SendMessageToGetUser(this.userName);
    this.connection.on(this.MessageReceiver, (username: string, data: RetrospectiveModel) => {
      this.dataReceived.next(data);
      this.userReceived.next(username);
      console.log('Received Message.' + JSON.stringify(data));
      console.log('Received Message userName.' + JSON.stringify(username));
    });
  }

  SendMessage(userName: string, msg: RetrospectiveModel): void {

    if (!msg.token) {
      msg.token = this.GetToken(msg.sprintId);
    }
    console.log('sendMessage() Called.' + JSON.stringify(msg));
    this.connection
      .invoke(this.hubMethodName, userName, msg).finally()
      .catch(err => console.log(err));
  }

  GetToken(sprintId: number) {
    return sprintId + '_' + Math.floor(Math.random() * (999 - 0)) + 0;
  }
  SendMessageToGetUser(userName: string): void {
    const dd: RetrospectiveModel = {
      commentId: 0,
      token: '',
      message: '',
      sprintId: 1,
      createdBy: 1,
      editable: true,
      type: 0,
      voteDown: 0,
      voteUp: 0,
      action : '',
      colorCode: ''
    };
    this.connection
      .invoke(this.hubMethodName, userName, dd).finally()
      .catch(err => console.log(err));
  }
}

// GO
// --select * From RetroCOmments
// -------------------------------------------------------------------------------------------------------
// --exec [uspRetroAddorUPpdate] 1 , '22 Test from stored proecedure', 1, '#red' , 1, 1, 0
// ALTER PROCEDURE [dbo].[uspRetroAddorUPpdate] 
// 	@CommentId int,
// 	@SprintId INT,
// 	@token varchar(50),
// 	@Message NVARCHAR(500),
// 	@CreatedBy INT,
// 	@ColorCode NVARCHAR(15),
// 	@Type INT,
// 	@VoteDown INT ,
// 	@VoteUp INT,
// 	@action varchar(10)

// AS
// BEGIN

// 	IF(isnull(@action,'') = 'd')
// 	BEGIN
// 		DELETE FROM RetroComments where SprintID = @SprintId AND CommentId = CommentId AND token = @token
// 	END

// 	ELSE BEGIN
// 		IF EXISTS ( SELECT top 1 1 FROM RetroComments WHERE CommentId = CommentId AND SprintId = @SprintId AND token = @token)
// 		BEGIN
// 			UPDATE RetroComments
// 			set
// 				Message = @Message,
// 				ColorCode = @ColorCode,
// 				VoteUp = @VoteUp,
// 				VoteDown = @VoteDown,
// 				[Type] = @Type
// 			WHERE SprintId = @SprintId
// 			AND CommentId = CommentId
// 			AND token = @token
// 		END
// 		ELSE BEGIN
// 			INSERT INTO RetroComments
// 				(token,[Message],SprintId,Editable,CreatedBy,ColorCode,Type,VoteDown,VoteUp)
// 		values (@token, @Message, @SprintId , 1,@CreatedBy ,@ColorCode ,@Type , @VoteDown  , @VoteUp  )
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


// GO

// CREATE TABLE [dbo].[RetroComments](
// 	[CommentId] [int] IDENTITY(1,1) NOT NULL,
// 	[token] [varchar](50) NOT NULL,
// 	[Message] [nvarchar](500) NULL,
// 	[SprintId] [int] NULL,
// 	[Editable] [bit] NULL,
// 	[CreatedBy] [int] NULL,
// 	[ColorCode] [nvarchar](15) NULL,
// 	[Type] [int] NULL,
// 	[VoteDown] [int] NULL,
// 	[VoteUp] [int] NULL,
//  CONSTRAINT [PK__RetroCom__93CBA2437CF14AC9] PRIMARY KEY CLUSTERED
// (
// [CommentId] ASC
// )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
// ) ON [PRIMARY]
// GO

// SET ANSI_PADDING OFF
// GO

// ALTER TABLE [dbo].[RetroComments]  WITH CHECK ADD  CONSTRAINT [FK__RetroComm__Sprin__1F63A897] FOREIGN KEY([SprintId])
// REFERENCES [dbo].[RetroSprint] ([SprintId])
// GO

// ALTER TABLE [dbo].[RetroComments] CHECK CONSTRAINT [FK__RetroComm__Sprin__1F63A897]
// GO

// -- exec uspRetroGet 1
// CREATE PROCEDURE uspRetroGet
// @SprintId int
// AS
// BEGIN
// 	select * From RetroCOmments where Sprintid = @SprintId
// END
