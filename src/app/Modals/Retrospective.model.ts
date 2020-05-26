export class RetrospectiveModel {
    commentId: number;
    token: string;
    message: string;
    sprintId: number;
    type: RetroType;
    voteUp: number;
    voteDown: number;
    editable: boolean;
    createdBy: number;
    colorCode: string;
    action: string;
}

export enum RetroType {
    well = 1,
    wrong,
    action
}

export class CardColors {
    ColorCode: string;
    ColorId: number;
}

export class ActiveUser {
    userName: string;
    profileImage: string;
}
