export class RetrospectiveModel {
    Message: string;
    SprintId: number;
    Type: RetroType;
    VoteUp: number;
    VoteDown: number;
    Editable: boolean;
    CreatedBy: number;
}

export enum RetroType {
    well = 1,
    wrong,
    action
}

export class RetrospectiveDbModel {
    RetroId: number;
    Message: string;
    SprintId: number;
    CreatedDate: Date;
}