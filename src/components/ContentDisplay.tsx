import * as React from "react";
import { IVisualData, IVisualTable } from "../defs/main";
import powerbi from "powerbi-visuals-api";
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
// import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
interface IContentDisplayProps {
  host: IVisualHost;
  visualData: IVisualData;
  visualTables: string;
}

interface IVisualTableProps {
  visualTable: IVisualTable;
  visualData: IVisualData;
}

function visualTable(props: IVisualTableProps, index: number) {
  const groupingColumnName = "dimUnit.short_title";
  return (
    <div key={index}>
      <table>
        <thead>
          <tr>
            <th>Clinical Unit</th>
          </tr>
        </thead>
        <tbody>
          {props.visualData.values.map((row) => {
            return (
              <tr>
                <td>{row[groupingColumnName]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function ContentDisplay(props: IContentDisplayProps) {
  const visualTables: IVisualTable[] = JSON.parse(props.visualTables)["tables"];
  //   const scrollbars = { autoUpdate: true };
  return (
    // <OverlayScrollbarsComponent>
    <div className="visual-tables">
      {visualTables.map((table, index) =>
        visualTable({ visualTable: table, visualData: props.visualData }, index)
      )}
    </div>
    // </OverlayScrollbarsComponent>
  );
}
