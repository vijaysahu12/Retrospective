export class RetrospectiveModel {
    Message: string;
    SprintId: number;
    Type: RetroType;
    VoteUp: number;
    VoteDown: number;
    Editable: boolean;
    CreatedBy: number;
    ColorCode: string;
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

export class CardColors {
    ColorCode: string;
    ColorId: number;
}