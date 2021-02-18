import * as React from "react";
import powerbi from "powerbi-visuals-api";
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import ILocalizationManager = powerbi.extensibility.ILocalizationManager;
import DataViewObject = powerbi.DataViewObject;

import VisualObjectInstancesToPersist = powerbi.VisualObjectInstancesToPersist;
import {
  AdvancedEditingSettings,
  TableTitleSettings,
  TrendLineSettings,
  MainMeasureSettings,
  SecondaryMeasureSettings,
} from "../../settings";
import { IVisualData, IVisualTable } from "../../defs/main";
import { ContentDisplay } from "./../ContentDisplay";
import NewTable from "./NewTable";
import EditTable from "./EditTable";
import AdvanceEditorData from "../../models/advanceEditor";
import Button from "@material-ui/core/Button";
import AlertDialog from "./AlertDialog";
import { Paper, Typography } from "@material-ui/core";
interface IAdvanceEditorProps {
  host: IVisualHost;
  localizationManager: ILocalizationManager;
  advancedEditing: AdvancedEditingSettings;
  advancedEditingObjectMetadata?: DataViewObject;
  visualData: IVisualData;
  advEditorData: AdvanceEditorData;
  tableTitleSettings?: TableTitleSettings;
  mainMeasureSettings?: MainMeasureSettings;
  secondaryMeasureSettings?: SecondaryMeasureSettings;
  trendLineSettings?: TrendLineSettings;
  // updateDisplayTables: Function;
  // visualTables: IVisualTable[];
}

interface IAdvancedEditorState {
  isDirty: boolean;
  visualTables: IVisualTable[];
  dialog: boolean;
}

// const initialState = {
//     isDirty: false

// }

export default class AdvanceEditor extends React.Component<
  IAdvanceEditorProps,
  IAdvancedEditorState
> {
  constructor(props: IAdvanceEditorProps) {
    super(props);
    this.state = {
      isDirty: false,
      visualTables: props.advEditorData.visualTables,
      dialog: false,
    };

    this.handleAddTableClick = this.handleAddTableClick.bind(this);
    this.handleResetClick = this.handleResetClick.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.handleEditTableUpdate = this.handleEditTableUpdate.bind(this);
    this.handleRemoveTable = this.handleRemoveTable.bind(this);
  }
  render() {
    const {
      host, // advancedEditing,
      visualData,
    } = this.props;
    const { isDirty, visualTables, dialog } = this.state;
    return (
      <div className="advanced-editor">
        <AlertDialog
          open={dialog}
          message={
            "Are sure you want to reset the visual tables? This action is permanent and you will loose your changes."
          }
          handleAgree={this.handleResetClick}
          handleDisagree={() => {
            this.setState({ dialog: false });
          }}
        />
        <div className="editor">
          <Typography variant="h6">Advanced Editor</Typography>
          <Typography variant="overline" color="secondary">
            {this.state.isDirty
              ? "You have unsaved changes. Please save your changes before exiting the advance editor mode."
              : ""}
          </Typography>
          {visualTables.map((table, tIdx) => {
            return (
              <EditTable
                index={tIdx}
                table={table}
                onEditTableUpdate={this.handleEditTableUpdate}
                onRemoveTable={this.handleRemoveTable}
                dataColumns={visualData.columns}
              />
            );
          })}
          {/* <Paper> */}
          <div className="editor__bottom-panel">
            <NewTable onAddTable={this.handleAddTableClick} />
            <div className="editor__actions">
              <Button
                variant="contained"
                disabled={visualTables.length === 0}
                onClick={() => {
                  this.setState({ dialog: true });
                }}
                title="Reset changes to visual"
              >
                Reset
              </Button>

              <Button
                variant="contained"
                color="primary"
                disabled={!isDirty}
                onClick={this.handleSaveClick}
                title="Save Changes"
              >
                Save Changes
              </Button>
            </div>
          </div>
          {/* </Paper> */}
        </div>
        {/* <hr /> */}
        <ContentDisplay
          host={host}
          visualData={visualData}
          visualTables={this.props.advEditorData.visualTables}
          tableTitleSettings={this.props.tableTitleSettings}
          mainMeasureSettings={this.props.mainMeasureSettings}
          secondaryMeasureSettings={this.props.secondaryMeasureSettings}
          trendLineSettings={this.props.trendLineSettings}
        />
      </div>
    );
  }

  private handleEditTableUpdate(table: IVisualTable, index: number) {
    // console.log(table);
    let visualTables = this.state.visualTables.slice(
      0,
      this.state.visualTables.length + 1
    );
    // console.log(visualTables);
    visualTables[index] = table;
    this.setState({
      isDirty: true,
      visualTables: visualTables,
    });
  }
  private handleRemoveTable(index: number) {
    // console.log(index);
    const totalVisualTables = this.state.visualTables.length;
    let visualTables = this.state.visualTables.slice(0, totalVisualTables + 1);
    // visualTables.splice(index, 1);

    // console.log(this.state.visualTables.slice(0, totalVisualTables + 1));
    this.setState({
      isDirty: true,
      visualTables: visualTables.filter((i, idx) => {
        return idx !== index;
      }),
    });
  }
  private handleAddTableClick(
    // e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    newTableName: string
  ) {
    // e.preventDefault();

    const visualTables = this.state.visualTables.slice(
      0,
      this.state.visualTables.length + 1
    );

    this.setState({
      visualTables: visualTables.concat([
        { columns: [], name: newTableName, totalTableColumns: 0 },
      ]),
      isDirty: true,
    });
  }

  // private handleResetClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
  //   e.preventDefault();
  private handleResetClick() {
    const changes = this.getNewObjectInstance();
    // const today = Date.now().toLocaleString();
    this.setState({ visualTables: [], isDirty: false, dialog: false }, () => {
      changes.replace[0].properties["visualTables"] = JSON.stringify({
        tables: [],
        tableCount: 0,
        updateDatetime: Date.now().toLocaleString(),
      });
      this.props.advEditorData.reset();
      this.props.host.persistProperties(changes);
    });
  }

  private handleSaveClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();

    const changes = this.getNewObjectInstance();

    this.setState({ isDirty: false }, () => {
      changes.replace[0].properties["visualTables"] = JSON.stringify({
        tables: [],
        tableCount: this.state.visualTables.length,
        updateDatetime: Date.now().toLocaleString(),
      });
      this.props.advEditorData.updateVisualTables(
        this.state.visualTables.slice(0, this.state.visualTables.length + 1)
      );
      this.props.host.persistProperties(changes);
    });
  }

  private getNewObjectInstance(): VisualObjectInstancesToPersist {
    return {
      replace: [
        {
          objectName: "advancedEditing",
          selector: null,
          properties: this.props.advancedEditingObjectMetadata || {},
        },
      ],
    };
  }
}
