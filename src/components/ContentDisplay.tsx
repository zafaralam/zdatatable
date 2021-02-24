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
  removeRowsWithNoData,
  getConditionalFormattingColor,
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
import Debugger from "../debug/Debugger";
import VisualTable from "./contentDisplay/VisualTable";
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

export function ContentDisplay(props: IContentDisplayProps) {
  //   const scrollbars = { autoUpdate: true };
  if (props.visualData !== undefined && props.visualData !== null)
    return (
      // <OverlayScrollbarsComponent>

      <div className="visual-tables">
        {props.visualTables.map((table, index) => {
          return (
            <VisualTable
              visualTable={table}
              visualData={props.visualData}
              index={index}
              tableTitleSettings={props.tableTitleSettings}
              mainMeasureSettings={props.mainMeasureSettings}
              secondaryMeasureSettings={props.secondaryMeasureSettings}
              trendLineSettings={props.trendLineSettings}
              groupingColumnSettings={props.groupingColumnSettings}
            />
          );
        })}
      </div>

      // </OverlayScrollbarsComponent>
    );
  else return <div className="no-data-content-display">No Data available</div>;
}
