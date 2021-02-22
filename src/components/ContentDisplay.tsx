import * as React from "react";

import {
  IVisualData,
  IVisualTable,
  IVisualTableColumn,
  IDataColumn,
} from "../defs/main";
import powerbi from "powerbi-visuals-api";
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import { valueFormatter } from "powerbi-visuals-utils-formattingutils";
// import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import {
  getTableValueColumns,
  getColumnSpan,
  getMaxTableHederDepth,
  getTableHeaderAtLevel,
  getHeaderColumnWidth,
  fontWeightCSSValue,
  textAlignCSSValue,
  fontFamilyCSSValue,
  borderGroupingColumCSSValue,
  validatePolyline,
} from "./../utils/common";
import { VISUAL_DISPLAY_COLUMN_TYPE } from "./../defs/enums";
import {
  TableTitleSettings,
  TrendLineSettings,
  MainMeasureSettings,
  SecondaryMeasureSettings,
  GroupingColumnSettings,
} from "../settings";
import { VisualConstants } from "../VisualConstants";
interface IContentDisplayProps {
  host: IVisualHost;
  visualData: IVisualData;
  visualTables: IVisualTable[];
  tableTitleSettings?: TableTitleSettings;
  mainMeasureSettings?: MainMeasureSettings;
  secondaryMeasureSettings?: SecondaryMeasureSettings;
  trendLineSettings?: TrendLineSettings;
  groupingColumnSettings?: GroupingColumnSettings;
}

interface IVisualTableProps {
  visualTable: IVisualTable;
  visualData: IVisualData;
  index: number;
  tableTitleSettings?: TableTitleSettings;
  mainMeasureSettings?: MainMeasureSettings;
  secondaryMeasureSettings?: SecondaryMeasureSettings;
  trendLineSettings?: TrendLineSettings;
  groupingColumnSettings: GroupingColumnSettings;
}

function visualTable(props: IVisualTableProps) {
  const {
    visualTable: table,
    visualData,
    index: tableIndex,
    tableTitleSettings,
    mainMeasureSettings,
    secondaryMeasureSettings,
    trendLineSettings,
    groupingColumnSettings,
  } = props;

  const tableTitleStyles: React.CSSProperties = {
    color: tableTitleSettings?.fontColor,
    background: tableTitleSettings?.backgroundColor,
    fontFamily: fontFamilyCSSValue(
      tableTitleSettings?.fontFamily || VisualConstants.dinReplacementFont
    ),
    fontSize: `${tableTitleSettings?.fontSize}pt`,
    padding: `${tableTitleSettings?.padding}px`,
    fontWeight: fontWeightCSSValue(
      tableTitleSettings?.fontWeight ||
        VisualConstants.tableTitleSettings.fontWeight
    ),
    textAlign: textAlignCSSValue(
      tableTitleSettings?.textAlign ||
        VisualConstants.tableTitleSettings.textAlign
    ),
    // ...titleFontWeight
  };

  const groupingColumnHeaderStyles: React.CSSProperties = {
    width: `${
      groupingColumnSettings?.width ||
      VisualConstants.groupingColumnSettings.width
    }px`,
    ...(groupingColumnSettings.applyBorderToHeader
      ? {
          border: borderGroupingColumCSSValue(
            groupingColumnSettings?.borderWidth,
            groupingColumnSettings?.borderColor
          ),
        }
      : {}),
    maxWidth: `${
      groupingColumnSettings?.width ||
      VisualConstants.groupingColumnSettings.width
    }px`,
    background:
      groupingColumnSettings?.headerBackgroundColor ||
      VisualConstants.groupingColumnSettings.headerBackgroundColor,
    color:
      groupingColumnSettings?.headerFontColor ||
      VisualConstants.groupingColumnSettings.headerFontColor,
    fontFamily: fontFamilyCSSValue(
      groupingColumnSettings?.headerFontFamily ||
        VisualConstants.groupingColumnSettings.headerFontFamily
    ),
    fontWeight: fontWeightCSSValue(
      groupingColumnSettings?.headerFontWeight ||
        VisualConstants.groupingColumnSettings.headerFontWeight
    ),
    fontSize: `${
      groupingColumnSettings?.headerFontSize ||
      VisualConstants.groupingColumnSettings.headerFontSize
    }pt`,
    textAlign: textAlignCSSValue(
      groupingColumnSettings?.headerTextAlign ||
        VisualConstants.groupingColumnSettings.headerTextAlign
    ),
  };

  const groupingColumnValuesStyles: React.CSSProperties = {
    ...(groupingColumnSettings.applyBorderToValues
      ? {
          border: borderGroupingColumCSSValue(
            groupingColumnSettings?.borderWidth,
            groupingColumnSettings?.borderColor
          ),
        }
      : {}),
    background:
      groupingColumnSettings?.valuesBackgroundColor ||
      VisualConstants.groupingColumnSettings.valuesBackgroundColor,
    color:
      groupingColumnSettings?.valuesFontColor ||
      VisualConstants.groupingColumnSettings.valuesFontColor,
    fontFamily: fontFamilyCSSValue(
      groupingColumnSettings?.valuesFontFamily ||
        VisualConstants.groupingColumnSettings.valuesFontFamily
    ),
    fontWeight: fontWeightCSSValue(
      groupingColumnSettings?.valuesFontWeight ||
        VisualConstants.groupingColumnSettings.valuesFontWeight
    ),
    fontSize: `${
      groupingColumnSettings?.valuesFontSize ||
      VisualConstants.groupingColumnSettings.valuesFontSize
    }pt`,
    textAlign: textAlignCSSValue(
      groupingColumnSettings?.valuesTextAlign ||
        VisualConstants.groupingColumnSettings.valuesTextAlign
    ),
  };

  const groupingColumn = visualData.columns.find((x) => x.grouping === true);
  // console.log(groupingColumn);
  // * Used to display values in the table
  const tableValueColumns = getTableValueColumns(table);
  const tableHeaderMaxDepth = getMaxTableHederDepth(table);

  // console.log(tableHeaderMaxDepth);
  return (
    <div key={tableIndex}>
      <table className="display-table">
        <thead>
          {props.visualTable.showTitle === true ? (
            <tr>
              <th
                colSpan={
                  tableValueColumns.length +
                    (groupingColumnSettings?.showGroupingColumn &&
                    groupingColumn !== undefined
                      ? 1
                      : 0) || 0
                }
                style={tableTitleStyles}
              >
                {props.visualTable?.name || "Table name not specified"}
              </th>
            </tr>
          ) : (
            ""
          )}
          {[...Array(tableHeaderMaxDepth)].map((_, i) => {
            return (
              <tr
                className={
                  getTableHeaderAtLevel(table, i + 1).length === 0
                    ? "empty-header-row"
                    : "header-row"
                }
              >
                {i === 0 &&
                groupingColumnSettings?.showGroupingColumn &&
                groupingColumn !== undefined ? (
                  <th
                    className="grouping-column__header"
                    rowSpan={tableHeaderMaxDepth}
                    style={groupingColumnHeaderStyles}
                  >
                    {/* <div
                      className="resize"
                      onMouseDown={(e) => {
                        console.log("mouse down:", e);
                      }}
                      onMouseMove={(e) => {
                        console.log("mouse move:", e);
                      }}
                    > */}
                    {groupingColumn?.displayName}
                    {/* </div> */}
                  </th>
                ) : (
                  ""
                )}
                {getTableHeaderAtLevel(table, i + 1).map((column, idxCol) => {
                  const width = getHeaderColumnWidth(column);

                  return (
                    <th
                      key={idxCol}
                      className={
                        column.label.length === 0 &&
                        column.columnType !==
                          VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY
                          ? "empty-header-col"
                          : ""
                      }
                      style={{
                        ...{
                          fontFamily:
                            column?.labelFontFamily ||
                            VisualConstants.visualTableColumn.labelFontFamily,
                          fontWeight: fontWeightCSSValue(
                            column?.labelFontWeight ||
                              VisualConstants.visualTableColumn.labelFontWeight
                          ),
                          width: `${width}px`,
                          borderLeft:
                            column.border?.left ||
                            VisualConstants.visualTableColumn.border.left,
                          borderTop:
                            column.border?.top ||
                            VisualConstants.visualTableColumn.border.top,
                          borderRight:
                            column.border?.right ||
                            VisualConstants.visualTableColumn.border.right,
                          borderBottom:
                            column.border?.bottom ||
                            VisualConstants.visualTableColumn.border.bottom,
                          background:
                            column?.bgColor ||
                            VisualConstants.visualTableColumn.bgColor,
                          color:
                            column?.textColor ||
                            VisualConstants.visualTableColumn.textColor,
                          fontSize: `${
                            column?.labelFontSize ||
                            VisualConstants.visualTableColumn.labelFontSize
                          }pt`,
                          textAlign: textAlignCSSValue(
                            column?.textAlign ||
                              VisualConstants.visualTableColumn.textAlign
                          ),
                          ...{
                            paddingLeft: `${
                              column.padding?.left ||
                              VisualConstants.visualTableColumn.padding.left
                            }px`,
                            paddingTop: `${
                              column.padding?.top ||
                              VisualConstants.visualTableColumn.padding.top
                            }px`,
                            paddingRight:
                              `${
                                column.padding?.right ||
                                VisualConstants.visualTableColumn.padding.right
                              }px` || 0,
                            paddingBottom:
                              `${
                                column.padding?.bottom ||
                                VisualConstants.visualTableColumn.padding.bottom
                              }px` || 0,
                          },
                        },
                      }}
                      colSpan={getColumnSpan(column)}
                      rowSpan={
                        (column.columns === undefined ||
                          column.columns.length === 0) &&
                        column.level < tableHeaderMaxDepth
                          ? tableHeaderMaxDepth - column.level + 1
                          : 1
                      }
                    >
                      {/* <div className="display-table__header-cell" style={{}}> */}
                      {column.label}
                      {/* </div> */}
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
        <tbody>
          {visualData.values.map((row) => {
            return (
              <tr>
                {groupingColumnSettings?.showGroupingColumn &&
                groupingColumn !== undefined ? (
                  <td
                    className="grouping-column__value"
                    style={groupingColumnValuesStyles}
                  >
                    {row[groupingColumn?.queryName]}
                  </td>
                ) : (
                  ""
                )}

                {tableValueColumns.map((col, i) => {
                  return CellValueDisplay(
                    col,
                    visualData.columns,
                    row,
                    mainMeasureSettings,
                    secondaryMeasureSettings,
                    trendLineSettings
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function CellValueDisplay(
  visualTableColumn: IVisualTableColumn,
  dataColumns: IDataColumn[],
  rowValue: any,
  mainMeasureSettings: MainMeasureSettings,
  secondaryMeasureSettings: SecondaryMeasureSettings,
  trendLineSettings: TrendLineSettings
) {
  const measureStyles: React.CSSProperties = {
    // display: "inline-block",
    // width: "100%", // * DO NOT REMOVE THIS FORM CELL.
    // textAlign: "center",

    ...(visualTableColumn.columnType ===
    VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_MAIN
      ? {
          fontFamily: fontFamilyCSSValue(
            mainMeasureSettings?.fontFamily ||
              VisualConstants.dinReplacementFont
          ),
          fontSize: `${mainMeasureSettings?.fontSize}pt`,
          fontWeight: fontWeightCSSValue(
            mainMeasureSettings?.fontWeight ||
              VisualConstants.mainMeasureSettings.fontWeight
          ),
          // color: mainMeasureSettings?.fontColor,
        }
      : {
          fontFamily: fontFamilyCSSValue(
            secondaryMeasureSettings?.fontFamily ||
              VisualConstants.dinReplacementFont
          ),
          fontSize: `${secondaryMeasureSettings?.fontSize}pt`,
          fontWeight: fontWeightCSSValue(
            secondaryMeasureSettings?.fontWeight ||
              VisualConstants.mainMeasureSettings.fontWeight
          ),
          // color: secondaryMeasureSettings?.fontColor,
        }),
  };

  let tdStyles: React.CSSProperties = {
    background:
      visualTableColumn.columnType !==
        VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY &&
      visualTableColumn.applyBgColorToValues === false
        ? "#fff"
        : visualTableColumn.bgColor,
    ...(visualTableColumn.columnType !== VISUAL_DISPLAY_COLUMN_TYPE.TREND_CHART
      ? {
          textAlign: textAlignCSSValue(
            visualTableColumn?.textAlign ||
              VisualConstants.visualTableColumn.textAlign
          ),
          width: `${
            visualTableColumn?.width ||
            (visualTableColumn.columnType ===
            VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_MAIN
              ? VisualConstants.mainMeasureCellWidth
              : VisualConstants.secondaryMeasureCellWidth)
          }px`,
        }
      : {}),
    ...(visualTableColumn.columnType === VISUAL_DISPLAY_COLUMN_TYPE.TREND_CHART
      ? {
          width: `${
            trendLineSettings?.width || VisualConstants.trendLineSettings.width
          }px`,
        }
      : {}),
    ...{
      borderLeft:
        visualTableColumn.border?.left ||
        VisualConstants.visualTableColumn.border.left,
      borderTop:
        visualTableColumn.border?.top ||
        VisualConstants.visualTableColumn.border.top,
      borderRight:
        visualTableColumn.border?.right ||
        VisualConstants.visualTableColumn.border.right,
      borderBottom:
        visualTableColumn.border?.bottom ||
        VisualConstants.visualTableColumn.border.bottom,

      paddingLeft: `${
        visualTableColumn.padding?.left ||
        VisualConstants.visualTableColumn.padding.left
      }px`,
      paddingTop: `${
        visualTableColumn.padding?.top ||
        VisualConstants.visualTableColumn.padding.top
      }px`,
      paddingRight: `${
        visualTableColumn.padding?.right ||
        VisualConstants.visualTableColumn.padding.right
      }px`,
      paddingBottom: `${
        visualTableColumn.padding?.bottom ||
        VisualConstants.visualTableColumn.padding.bottom
      }px`,
    },
  };

  // Original
  // const points =
  //   "-18035,0 -76,18 -63,18 -51,0 -38,0 -26,0 -13,18 0,18 11,0 24,18 37,18 49,0 62,0 74,0 87,0 99,18 112,18 124,0 137,18 150,18 162,18";

  // Testing only
  const points = rowValue[visualTableColumn.queryName];
  //"-26,0 -13,18 0,18 11,0 24,18 37,18 112,18 124,0 137,18 150,18 162,18";
  const cellDisplay = (
    <td style={tdStyles}>
      {visualTableColumn.columnType ===
      VISUAL_DISPLAY_COLUMN_TYPE.TREND_CHART ? (
        points && validatePolyline(points) ? (
          <svg
            style={{
              height: `${trendLineSettings?.height}px`,
              width: `${trendLineSettings?.width}px`,
            }}
          >
            <g transform="translate(9, 1)">
              <polyline
                stroke={trendLineSettings?.strokeColor}
                fill={trendLineSettings?.fillColor}
                stroke-width={`${trendLineSettings?.strokeWidth}`}
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-dasharray="0"
                points={points}
              />
            </g>
          </svg>
        ) : (
          ""
        )
      ) : visualTableColumn.queryName.length === 0 ||
        rowValue[visualTableColumn.queryName] === undefined ||
        rowValue[visualTableColumn.queryName] === null ||
        (rowValue[visualTableColumn.queryName] as string) === "" ? (
        <div style={{ minHeight: `${trendLineSettings.height}px` }}></div>
      ) : (
        <span style={measureStyles}>
          {valueFormatter.format(
            rowValue[visualTableColumn.queryName],
            dataColumns.find((c) => c.queryName === visualTableColumn.queryName)
              .format
          )}
        </span>
      )}
    </td>
  );
  return cellDisplay;
}

export function ContentDisplay(props: IContentDisplayProps) {
  //   const scrollbars = { autoUpdate: true };
  if (props.visualData !== undefined && props.visualData !== null)
    return (
      // <OverlayScrollbarsComponent>

      <div className="visual-tables">
        {props.visualTables.map((table, index) =>
          visualTable({
            visualTable: table,
            visualData: props.visualData,
            index: index,
            tableTitleSettings: props.tableTitleSettings,
            mainMeasureSettings: props.mainMeasureSettings,
            secondaryMeasureSettings: props.secondaryMeasureSettings,
            trendLineSettings: props.trendLineSettings,
            groupingColumnSettings: props.groupingColumnSettings,
          })
        )}
      </div>

      // </OverlayScrollbarsComponent>
    );
  else return <div className="no-data-content-display">No Data available</div>;
}

{
  /* <table>
  <thead>
    <tr>
      <th>{groupingColumn.displayName}</th>
    </tr>
  </thead>
  <tbody>
    {visualData.values.map((row) => {
      return (
        <tr>
          <td>{row[groupingColumn.queryName]}</td>
        </tr>
      );
    })}
  </tbody>
</table>; */
}
