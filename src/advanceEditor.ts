import { IVisualTable } from "./defs/main";

export default class AdvanceEditorData {
  public visualTables: IVisualTable[] = [];

  public addTable(table: IVisualTable) {
    this.visualTables = this.visualTables.concat([table]);
  }

  public updateVisualTables(tables: IVisualTable[]) {
    this.visualTables = tables;
  }

  public reset() {
    this.visualTables = [];
  }
}
