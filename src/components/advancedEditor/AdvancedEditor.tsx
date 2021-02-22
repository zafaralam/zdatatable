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
  GroupingColumnSettings,
} from "../../settings";
import { IVisualData, IVisualTable } from "../../defs/main";
import { ContentDisplay } from "./../ContentDisplay";
import NewTable from "./NewTable";
import EditTable from "./EditTable";
import AdvanceEditorData from "../../models/advanceEditor";
import Button from "@material-ui/core/Button";
import AlertDialog from "./AlertDialog";
import { Grid, Typography } from "@material-ui/core";
import { VisualConstants } from "./../../VisualConstants";
import { BsEyeSlash, BsEye } from "react-icons/bs";
import { MOVE_DIRECTION } from "../../defs/enums";
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
  groupingColumnSettings?: GroupingColumnSettings;
  // updateDisplayTables: Function;
  // visualTables: IVisualTable[];
}

interface IAdvancedEditorState {
  isDirty: boolean;
  visualTables: IVisualTable[];
  dialog: boolean;
  hidePreview: boolean;
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
      hidePreview: false,
    };

    this.handleAddTableClick = this.handleAddTableClick.bind(this);
    this.handleResetClick = this.handleResetClick.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.handleEditTableUpdate = this.handleEditTableUpdate.bind(this);
    this.handleRemoveTable = this.handleRemoveTable.bind(this);
    this.handleTableMove = this.handleTableMove.bind(this);
    this.handleDuplicationOfTable = this.handleDuplicationOfTable.bind(this);
  }
  render() {
    const {
      host, // advancedEditing,
      visualData,
    } = this.props;
    const { isDirty, visualTables, dialog } = this.state;
    return (
      <div
        className={`advanced-editor ${
          this.state.hidePreview ? "preview-hidden" : ""
        }`}
      >
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
        <div className="editor__header">
          <Grid
            container
            direction="row"
            alignItems="center"
            justify="space-between"
            style={{ margin: "4px 0" }}
          >
            <Grid item xs={2}>
              <Typography variant="h6">Advanced Editor</Typography>
            </Grid>
            <Grid container item xs={4} justify="flex-end">
              <Button
                color="primary"
                onClick={(e) => {
                  this.setState({ hidePreview: !this.state.hidePreview });
                }}
                startIcon={this.state.hidePreview ? <BsEye /> : <BsEyeSlash />}
              >
                {`${this.state.hidePreview ? "Show" : "Hide"}`} Preview
              </Button>
            </Grid>
          </Grid>
        </div>
        <div className="editor">
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
                onTableMove={this.handleTableMove}
                onDuplicationOfTable={this.handleDuplicationOfTable}
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
        {!this.state.hidePreview ? (
          <ContentDisplay
            host={host}
            visualData={visualData}
            visualTables={this.props.advEditorData.visualTables}
            tableTitleSettings={this.props.tableTitleSettings}
            mainMeasureSettings={this.props.mainMeasureSettings}
            secondaryMeasureSettings={this.props.secondaryMeasureSettings}
            trendLineSettings={this.props.trendLineSettings}
            groupingColumnSettings={this.props.groupingColumnSettings}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
  private handleDuplicationOfTable(table: IVisualTable) {
    const visualTables = this.state.visualTables.slice(
      0,
      this.state.visualTables.length + 1
    );

    this.setState({
      visualTables: visualTables.concat([table]),
      isDirty: true,
    });
  }

  private handleTableMove(direction: MOVE_DIRECTION, tableIndex: number) {
    if (
      (direction === MOVE_DIRECTION.UP && tableIndex === 0) ||
      (direction === MOVE_DIRECTION.DOWN &&
        tableIndex === this.state.visualTables.length - 1)
    ) {
      return;
    }

    const toIndex =
      direction === MOVE_DIRECTION.UP ? tableIndex - 1 : tableIndex + 1;
    // console.log(MOVE_DIRECTION[direction].toString(), tableIndex, toIndex);
    let visualTables = this.state.visualTables.slice(
      0,
      this.state.visualTables.length + 1
    );
    var element = visualTables[tableIndex];
    visualTables.splice(tableIndex, 1);
    visualTables.splice(toIndex, 0, element);
    this.setState({
      isDirty: true,
      visualTables: visualTables,
    });
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
        {
          columns: VisualConstants.visualTable.columns,
          name: newTableName,
          totalTableColumns: 0,
          fullWidth: VisualConstants.visualTable.fullWidth,
          showTitle: VisualConstants.visualTable.showTitle,
        },
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
        tables: JSON.stringify(this.state.visualTables),
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
