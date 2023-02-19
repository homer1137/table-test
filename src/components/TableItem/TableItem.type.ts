export interface ILine {
    id?: number;
    child?: any[];
    equipmentCosts: number;
    estimatedProfit: number;
    machineOperatorSalary: number;
    mainCosts: number;
    materials: number;
    mimExploitation: number;
    overheads: number;
    parentId?: number | null ;
    rowName: string;
    salary: number;
    supportCosts: number;
    level?: number;
    new?: boolean;
  }
 
