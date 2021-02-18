import { BsColumns } from "react-icons/bs";
import {
  IVisualTable,
  IVisualTableColumn,
  //   ITableValueColumn,
} from "../defs/main";
import { VISUAL_DISPLAY_COLUMN_TYPE } from "./../defs/enums";

export function getTableValueColumns(
  table: IVisualTable
): IVisualTableColumn[] {
  return table.columns.reduce(flattenValueColumns, []);
}

export function getColumnSpan(column: IVisualTableColumn): number {
  if (column.columns) return column.columns.reduce(flattenColumnCount, 0);
  else 1;
}

export function getMaxTableHederDepth(table: IVisualTable): number {
  return table.columns.reduce(getMaxDepth, 0);
}

export function getTableHeaderAtLevel(
  table: IVisualTable,
  level: number
): IVisualTableColumn[] {
  //   console.log(level);
  function flatten(r: any, a: any) {
    // console.log(r, a);
    if (a.level < level && a.columns) {
      return a.columns.reduce(flatten, r);
    }
    if (
      (a.level === level &&
        a.columnType === VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY) ||
      (a.level === level &&
        a.columnType !== VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY &&
        a.label.length !== 0)
    )
      r.push(a);
    return r;
  }
  return table.columns.reduce(flatten, []);
}

function getMaxDepth(r: number, a: IVisualTableColumn) {
  if (a.columns && a.columns.length !== 0) {
    return a.columns.reduce(getMaxDepth, r);
  }

  if (r < a.level) {
    r = a.level;
  }
  return r;
}

function flattenColumnCount(r: any, a: IVisualTableColumn) {
  if (a.columns && a.columns.length !== 0) {
    return a.columns.reduce(flattenColumnCount, r);
  }
  return r + 1;
}

function flattenValueColumns(r: any, a: IVisualTableColumn) {
  if (a.columns && a.columns.length !== 0) {
    return a.columns.reduce(flattenValueColumns, r);
  }

  //   r.push({ queryName: a.queryName, columnType: a.columnType });
  r.push(a);
  return r;
}
