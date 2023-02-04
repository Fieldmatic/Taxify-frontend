export class ReportData {
  constructor(
    public initDate: Date,
    public termDate: Date,
    public numberOfRidesPerDate: GraphNode[],
    public averageNumberOfRidesPerDate: number,
    public totalNumberOfRidesForPeriod: number,
    public numberOfKilometersPerDate: GraphNode[],
    public averageNumberOfKilometersPerDate: number,
    public totalNumberOfKilometersForPeriod: number,
    public totalMoneyAmountPerDate: GraphNode[],
    public averageMoneyAmountPerDate: number,
    public totalMoneyAmountForPeriod: number
  ) {}
}

export class GraphNode {
  constructor(public x: string, public y: string) {}
}
