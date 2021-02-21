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
} from "./../utils/common";
import { VISUAL_DISPLAY_COLUMN_TYPE } from "./../defs/enums";
import {
  TableTitleSettings,
  TrendLineSettings,
  MainMeasureSettings,
  SecondaryMeasureSettings,
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
}

interface IVisualTableProps {
  visualTable: IVisualTable;
  visualData: IVisualData;
  index: number;
  tableTitleSettings?: TableTitleSettings;
  mainMeasureSettings?: MainMeasureSettings;
  secondaryMeasureSettings?: SecondaryMeasureSettings;
  trendLineSettings?: TrendLineSettings;
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
  } = props;
  const tableTitleStyles: React.CSSProperties = {
    color: tableTitleSettings?.fontColor,
    background: tableTitleSettings?.backgroundColor,
    fontFamily: tableTitleSettings?.fontFamily,
    fontSize: `${tableTitleSettings?.fontSize}pt`,
    padding: `${tableTitleSettings?.padding}px`,
  };
  const groupingColumn = visualData.columns.find((x) => x.grouping === true);
  // console.log("Ok here");
  // * this would be used to display values in the table
  const tableValueColumns = getTableValueColumns(table);
  const tableHeaderMaxDepth = getMaxTableHederDepth(table);

  // console.log(tableHeaderMaxDepth);
  return (
    <div key={tableIndex}>
      <table className="display-table">
        {props.visualTable.showTitle === true ? (
          <caption style={tableTitleStyles}>{table.name}</caption>
        ) : (
          ""
        )}
        <thead>
          {[...Array(tableHeaderMaxDepth)].map((_, i) => {
            return (
              <tr
                className={
                  getTableHeaderAtLevel(table, i + 1).length === 0
                    ? "empty-header-row"
                    : "header-row"
                }
              >
                {i === 0 ? (
                  <th rowSpan={tableHeaderMaxDepth}>
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
                  const txtAlign =
                    column?.textAlign === "left"
                      ? "left"
                      : column?.textAlign === "right"
                      ? "right"
                      : "center";

                  return (
                    <th
                      className={
                        column.label.length === 0 &&
                        column.columnType !==
                          VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY
                          ? "empty-header-col"
                          : ""
                      }
                      style={{
                        ...{
                          borderLeft: column.border?.left || "none",
                          borderTop: column.border?.top || "none",
                          borderRight: column.border?.right || "none",
                          borderBottom: column.border?.bottom || "none",
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
                      <div
                        className="display-table__header-cell"
                        style={{
                          background: column?.bgColor || "#fff",
                          color: column?.textColor || "#000",
                          fontSize: `${
                            column?.labelFontSize ||
                            VisualConstants.visualTableColumn.labelFontSize
                          }px`,
                          textAlign: txtAlign,
                          ...{
                            paddingLeft: `${column.padding?.left}px` || 0,
                            paddingTop: `${column.padding?.top}px` || 0,
                            paddingRight: `${column.padding?.right}px` || 0,
                            paddingBottom: `${column.padding?.bottom}px` || 0,
                          },
                        }}
                      >
                        {column.label}
                      </div>
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
                <td>{row[groupingColumn?.queryName]}</td>
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
  const txtAlign =
    visualTableColumn?.textAlign === "left"
      ? "left"
      : visualTableColumn?.textAlign === "right"
      ? "right"
      : "center";
  const measureStyles: React.CSSProperties = {
    display: "inline-block",
    width: "100%", // * DO NOT REMOVE THIS FORM CELL.
    // textAlign: "center",

    ...(visualTableColumn.columnType ===
    VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_MAIN
      ? {
          fontFamily: `${mainMeasureSettings?.fontFamily}, helvetica, arial, sans-serif`,
          fontSize: mainMeasureSettings?.fontSize,
          // color: mainMeasureSettings?.fontColor,
        }
      : {
          fontFamily: `${secondaryMeasureSettings?.fontFamily}, helvetica, arial, sans-serif`,
          fontSize: secondaryMeasureSettings?.fontSize,
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
          textAlign: txtAlign,
          width: `${visualTableColumn?.width || 50}px`,
        }
      : {}),
    ...{
      borderLeft: visualTableColumn.border?.left || "none",
      borderTop: visualTableColumn.border?.top || "none",
      borderRight: visualTableColumn.border?.right || "none",
      borderBottom: visualTableColumn.border?.bottom || "none",

      paddingLeft: `${visualTableColumn.padding?.left}px` || 0,
      paddingTop: `${visualTableColumn.padding?.top}px` || 0,
      paddingRight: `${visualTableColumn.padding?.right}px` || 0,
      paddingBottom: `${visualTableColumn.padding?.bottom}px` || 0,
    },
  };

  const cellDisplay = (
    <td style={tdStyles}>
      {visualTableColumn.columnType ===
      VISUAL_DISPLAY_COLUMN_TYPE.TREND_CHART ? (
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
              points="-18035,0 -76,18 -63,18 -51,0 -38,0 -26,0 -13,18 0,18 11,0 24,18 37,18 49,0 62,0 74,0 87,0 99,18 112,18 124,0 137,18 150,18 162,18"
            />
          </g>
        </svg>
      ) : visualTableColumn.queryName.length === 0 ||
        rowValue[visualTableColumn.queryName] === undefined ||
        rowValue[visualTableColumn.queryName] === null ||
        (rowValue[visualTableColumn.queryName] as string) === "" ? (
        ""
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
