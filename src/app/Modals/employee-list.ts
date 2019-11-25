
export interface EmployeeList {
  EmployeeName: string;
  ProjectName: string;
  ProfileImage: string;
  Days: Days[];
}


export interface Days {
  RosterDate: Date;
  RosterDayName: string;
  ShiftTime: string;
  ShiftColor: string;
  ShiftId: number;
}
