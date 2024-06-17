type Obj = {
  value: number;
  text: string;
};

export interface GroupCompany extends Obj {
  dependencies: {
    positions: Obj[];
  } & Obj[];
}
