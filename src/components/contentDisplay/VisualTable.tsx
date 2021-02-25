import * as React from "react";
import powerbi from "powerbi-visuals-api";
import IVisualHost = powerbi.extensibility.visual.IVisualHost;

import { IVisualData, IVisualTable, IVisualValues } from "./../../defs/main";

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
  removeRowsWithNoData,
} from "./../../utils/common";
import { VISUAL_DISPLAY_COLUMN_TYPE } from "./../../defs/enums";
import {
  TableTitleSettings,
  TrendLineSettings,
  MainMeasureSettings,
  SecondaryMeasureSettings,
  GroupingColumnSettings,
  TablesSettings,
} from "./../../settings";
import { VisualConstants } from "./../../VisualConstants";
import Debugger from "./../../debug/Debugger";
import CellValueDisplay from "./CellValueDisplay";

interface IVisualTableProps {
  visualTable: IVisualTable;
  visualData: IVisualData;
  index: number;
  tableTitleSettings?: TableTitleSettings;
  mainMeasureSettings?: MainMeasureSettings;
  secondaryMeasureSettings?: SecondaryMeasureSettings;
  trendLineSettings?: TrendLineSettings;
  groupingColumnSettings: GroupingColumnSettings;
  tablesSettings: TablesSettings;
  selectionManager: powerbi.extensibility.ISelectionManager;
}

export default function VisualTable(props: IVisualTableProps) {
  const {
    visualTable: table,
    visualData,
    index: tableIndex,
    tableTitleSettings,
    mainMeasureSettings,
    secondaryMeasureSettings,
    trendLineSettings,
    groupingColumnSettings,
    tablesSettings,
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

  const filteredVisualValues = tablesSettings.filterEmptyRows
    ? removeRowsWithNoData(visualData.values, tableValueColumns)
    : visualData.values;
  /** added sorting by default to the capabilities.json file.
    *
    .sort(function (a, b) {
    if (a[groupingColumn.queryName] < b[groupingColumn.queryName]) {
      return -1;
    }
    if (b[groupingColumn.queryName] < a[groupingColumn.queryName]) {
      return 1;
    }
    return 0;
  });*/

  // console.log(tableHeaderMaxDepth);
  const tableStyles: React.CSSProperties = {
    border: `${tablesSettings.borderWidth}px solid ${tablesSettings.borderColor}`,
  };

  const handleDataRowClick = (row: IVisualValues, index: number) => {
    if (row["rowInternalPowerBiSelectionId"]) {
      props.selectionManager.select(row["rowInternalPowerBiSelectionId"]);
    }
  };
  return (
    <div key={tableIndex}>
      <table className="display-table" style={tableStyles}>
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
                key={i}
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
          {filteredVisualValues.length === 0 ? (
            <tr className="no-data__row">
              <td className="no-data__cell">{tablesSettings.noDataMessage}</td>
            </tr>
          ) : (
            filteredVisualValues.map((row, rIdx) => {
              return (
                <tr
                  key={rIdx}
                  onClick={() => {
                    handleDataRowClick(row, rIdx);
                  }}
                  onContextMenu={(e) => {
                    props.selectionManager.showContextMenu(
                      row["rowInternalPowerBiSelectionId"],
                      { x: e.clientX, y: e.clientY }
                    );
                    e.preventDefault();
                  }}
                >
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
                    return (
                      <CellValueDisplay
                        key={i}
                        index={i}
                        visualTableColumn={col}
                        dataColumns={visualData.columns}
                        rowValue={row}
                        mainMeasureSettings={mainMeasureSettings}
                        secondaryMeasureSettings={secondaryMeasureSettings}
                        trendLineSettings={trendLineSettings}
                      />
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
