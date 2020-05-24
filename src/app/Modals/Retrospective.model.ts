export class RetrospectiveModel {
    retroId: number;
    message: string;
    sprintId: number;
    type: RetroType;
    voteUp: number;
    voteDown: number;
    editable: boolean;
    createdBy: number;
    colorCode: string;
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
