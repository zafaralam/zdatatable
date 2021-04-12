import {
  IVisualTable,
  IVisualTableColumn,
  IVisualValues,
  //   ITableValueColumn,
  IConditionalFormattingRule,
} from "../defs/main";
import {
  VISUAL_DISPLAY_COLUMN_TYPE,
  LtConditionOptions,
  GtConditionOptions,
} from "./../defs/enums";
import { VisualConstants } from "./../VisualConstants";
import powerbi from "powerbi-visuals-api";
import PrimitiveValue = powerbi.PrimitiveValue;
// import Debugger from "../debug/Debugger";

export function removeRowsWithNoData(
  visualValues: IVisualValues[],
  visualTableColumns: IVisualTableColumn[]
): IVisualValues[] {
  if (
    visualTableColumns &&
    visualTableColumns.length !== 0 &&
    visualValues &&
    visualValues.length !== 0
  ) {
    const columns = visualTableColumns.filter(
      (col) => col?.queryName && col.queryName.length !== 0
    );
    // const values =
    return visualValues.filter((values) => {
      const rowValues = columns.map((col) => values[col.queryName]);
      if (
        rowValues.every((element) => element === undefined || element === null)
      )
        return false;
      return true;
    });
    // console.log(columns);
    // console.log(values);

    // return values;
  }
  return [];
}

export function getTableValueColumns(
  table: IVisualTable
): IVisualTableColumn[] {
  function flattenValueColumns(r: any, a: IVisualTableColumn) {
    if (a.columns && a.columns.length !== 0) {
      return a.columns.reduce(flattenValueColumns, r);
    }

    //   r.push({ queryName: a.queryName, columnType: a.columnType });
    r.push(a);
    return r;
  }

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

export function fontWeightCSSValue(fontWeight: string) {
  switch (fontWeight) {
    case "normal":
      return <"normal">"normal";
    case "lighter":
      return <"lighter">"lighter";
    case "bold":
      return <"bold">"bold";
    case "initial":
      return <"initial">"initial";
    default:
      return <"normal">"normal";
  }
}

export function textAlignCSSValue(textAlign: string) {
  switch (textAlign) {
    case "center":
      return <"center">"center";
    case "left":
      return <"left">"left";
    case "right":
      return <"right">"right";
    default:
      return <"center">"center";
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
  const totalPoints = polyline.match(/\d+,\d+/g);
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
    totalPoints.length === totalCommas.length &&
    totalPoints.length === totalWhiteSpaces.length + 1
  );
}

/**
 * Returns a color based on the conditional formatting rules passed.
 * @param rules
 * @param dataValue
 */
export function getConditionalFormattingColor(
  rules: IConditionalFormattingRule[],
  dataValue: PrimitiveValue
): string {
  let color = VisualConstants.defaultTextColor; // default color if no conditional formatting is applied
  if (dataValue === undefined || rules === undefined) return color;
  // Debugger.START("Conditional Formatting");
  rules.forEach((rule: IConditionalFormattingRule, index: number) => {
    // Just ensuring that the rule.gtValue was entered and if not
    // then the rule would be skipped.
    switch (rule.gtOption) {
      /**
       * Perform check for each combination of "Greater Than"
       */
      case GtConditionOptions.Gt:
        if (rule.ltOption === LtConditionOptions.Lt && rule.ltValue) {
          if (dataValue > rule.gtValue && dataValue < rule.ltValue) {
            color = rule.color;
          }
        } else if (rule.ltOption === LtConditionOptions.LtEq && rule.ltValue) {
          if (dataValue > rule.gtValue && dataValue <= rule.ltValue) {
            color = rule.color;
          }
        } //if (rule.ltOption === NaN)
        else {
          if (rule.gtValue && dataValue > rule.gtValue) {
            color = rule.color;
          }
        }
        break;

      /**
       * Perform check for each combination of "Greater Than and Equal Too"
       */
      case GtConditionOptions.GtEq:
        // Debugger.LOG("GtCondition.GtEq");
        if (rule.ltOption === LtConditionOptions.Lt && rule.ltValue) {
          if (dataValue >= rule.gtValue && dataValue < rule.ltValue) {
            color = rule.color;
          }
        } else if (rule.ltOption === LtConditionOptions.LtEq && rule.ltValue) {
          if (dataValue >= rule.gtValue && dataValue <= rule.ltValue) {
            color = rule.color;
          }
        } //if (rule.ltOption === NaN)
        else {
          if (dataValue >= rule.gtValue) {
            color = rule.color;
          }
        }
        break;

      /**
       * Perform check for "Is" or Equal
       */
      case GtConditionOptions.Is:
        // Debugger.LOG("GtCondition.Is");
        if (dataValue == rule.gtValue) {
          color = rule.color;
        }
        break;

      /**
       * Perform check for Blank
       */
      case GtConditionOptions.Blank:
        // Debugger.LOG("GtCondition.Blank");
        if (dataValue === NaN) {
          color = rule.color;
        }
        break;
      default:
        break;
    }
  });

  // Debugger.END();

  return color;
}
