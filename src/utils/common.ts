import { csvParse } from "d3";
import { BsColumns } from "react-icons/bs";
import {
  IVisualTable,
  IVisualTableColumn,
  //   ITableValueColumn,
} from "../defs/main";
import { VISUAL_DISPLAY_COLUMN_TYPE } from "./../defs/enums";
import { VisualConstants } from "./../VisualConstants";

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

export function getHeaderColumnWidth(column: IVisualTableColumn): number {
  function flatten(r: number, a: IVisualTableColumn) {
    if (a.columns && a.columns.length !== 0) {
      return a.columns.reduce(flatten, r);
    }

    if (a.columnType !== VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY) {
      if (a?.width) {
        r = r + a.width;
        return r;
      } else {
        switch (a.columnType) {
          case VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_MAIN:
            r = r + VisualConstants.mainMeasureCellWidth;
            break;
          case VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_SECONDARY:
            r = r + VisualConstants.secondaryMeasureCellWidth;
            break;
          case VISUAL_DISPLAY_COLUMN_TYPE.TREND_CHART:
            r = r + VisualConstants.trendLineSettings.width;
            break;
          default:
            break;
        }
        return r;
      }
    }
  }

  if (column.columns && column.columns.length !== 0)
    return column.columns.reduce(flatten, 0);
  else {
    if (column?.width) return column.width;
    else {
      switch (column.columnType) {
        case VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_MAIN:
          return VisualConstants.mainMeasureCellWidth;
        case VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_SECONDARY:
          return VisualConstants.secondaryMeasureCellWidth;
          break;
        case VISUAL_DISPLAY_COLUMN_TYPE.TREND_CHART:
          return VisualConstants.trendLineSettings.width;

        default:
          return 0;
      }
    }
  }
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

export function fontWeightCSSValue(fontWeight: string) {
  switch (fontWeight) {
    case "normal":
      return "normal" as "normal";
    case "lighter":
      return "lighter" as "lighter";
    case "bold":
      return "bold" as "bold";
    case "initial":
      return "initial" as "initial";
    default:
      return "normal" as "normal";
  }
}

export function textAlignCSSValue(textAlign: string) {
  switch (textAlign) {
    case "center":
      return "center" as "center";
    case "left":
      return "left" as "left";
    case "right":
      return "right" as "right";
    default:
      return "center" as "center";
  }
}

export function fontFamilyCSSValue(fontFamily: string) {
  if (fontFamily.indexOf("wf_standard-font") !== -1) {
    return VisualConstants.dinReplacementFont;
  } else return fontFamily;
}

export function borderGroupingColumCSSValue(
  width: number,
  color: string
): string {
  if (width === undefined || width === null || width === 0) return "none";
  return `${
    width || VisualConstants.groupingColumnSettings.borderWidth
  }px solid ${color || VisualConstants.groupingColumnSettings.borderWidth}`;
}

export function validatePolyline(polyline: string): boolean {
  const totalPoints = polyline.match(/\d+,\d+/g).length;
  const totalCommas = polyline.match(/,/g);
  const totalWhiteSpaces = polyline.match(/\s/g);
  // console.log(totalPoints, totalCommas, totalWhiteSpaces);
  if (
    totalPoints === undefined ||
    totalCommas === undefined ||
    totalWhiteSpaces === undefined ||
    totalPoints === null ||
    totalCommas === null ||
    totalWhiteSpaces === null
  )
    return false;
  return (
    totalPoints === totalCommas.length &&
    totalPoints === totalWhiteSpaces.length + 1
  );
}
