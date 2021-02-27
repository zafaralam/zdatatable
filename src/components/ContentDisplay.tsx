import * as React from "react";

import {
  IVisualData,
  IVisualTable,
  IVisualTableColumn,
  IDataColumn,
} from "../defs/main";
import powerbi from "powerbi-visuals-api";
import IVisualHost = powerbi.extensibility.visual.IVisualHost;

import {
  TableTitleSettings,
  TrendLineSettings,
  MainMeasureSettings,
  SecondaryMeasureSettings,
  GroupingColumnSettings,
  TablesSettings,
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
  tablesSettings?: TablesSettings;
  selectionManager: powerbi.extensibility.ISelectionManager;
}

export function ContentDisplay(props: IContentDisplayProps) {
  //   const scrollbars = { autoUpdate: true };

  if (
    props.visualData !== undefined &&
    props.visualData !== null &&
    props.visualTables &&
    props.visualTables.length !== 0
  )
    return (
      <div className="visual-tables">
        {props.visualTables.map((table, index) => {
          return (
            <div
              style={{
                marginBottom:
                  index !== props.visualTables.length - 1
                    ? `${props.tablesSettings.spaceBetweenTables}px`
                    : "0",
              }}
            >
              <VisualTable
                visualTable={table}
                visualData={props.visualData}
                index={index}
                tableTitleSettings={props.tableTitleSettings}
                mainMeasureSettings={props.mainMeasureSettings}
                secondaryMeasureSettings={props.secondaryMeasureSettings}
                trendLineSettings={props.trendLineSettings}
                groupingColumnSettings={props.groupingColumnSettings}
                tablesSettings={props.tablesSettings}
                selectionManager={props.selectionManager}
              />
            </div>
          );
        })}
      </div>
    );
  else
    return (
      <div className="no-data-content-display">
        <div className="starter-message">
          <h4>z-DataTable</h4>
          <div>
            <p>
              Ensure the below steps have been completed for table(s) to be
              displayed:
            </p>

            <ul>
              <li>
                <em>-</em> Add a grouping column to the "Grouping" well from
                your data model
              </li>
              <li>
                <em>-</em> Add measure from your data model to the "Content"
                well
              </li>

              <li>
                <em>-</em> Click the "..." dots (More Options) when the visual
                is selected and then select "Edit" from the pop-menu.
              </li>
              <li>
                <em>-</em> Once in the advance editor. Start by adding tables
                and columns to tables.
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
}
