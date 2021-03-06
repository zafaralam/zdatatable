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
  TablesSettings,
} from "../../settings";
import { IVisualData, IVisualTable } from "../../defs/main";
import { contentDisplay as ContentDisplay } from "./../ContentDisplay";
import NewTable from "./NewTable";
import EditTable from "./EditTable";
import AdvanceEditorData from "../../models/AdvanceEditorData";
import Button from "@material-ui/core/Button";
import AlertDialog from "./AlertDialog";
import { Grid, Typography } from "@material-ui/core";
import { VisualConstants } from "./../../VisualConstants";
import { BsEyeSlash, BsEye, BsPencilSquare } from "react-icons/bs";
import { MOVE_DIRECTION } from "../../defs/enums";
import JSONEditor from "./JSONEditor";
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
  tablesSettings?: TablesSettings;
  selectionManager: powerbi.extensibility.ISelectionManager;
  // updateDisplayTables: Function;
  // visualTables: IVisualTable[];
}

interface IAdvancedEditorState {
  isDirty: boolean;
  visualTables: IVisualTable[];
  dialog: boolean;
  hidePreview: boolean;
  jsonEditorOpen: boolean;
}

// const initialState = {
//     isDirty: false

// }

export default class AdvancedEditor extends React.Component<
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
      jsonEditorOpen: false,
    };

    this.handleAddTableClick = this.handleAddTableClick.bind(this);
    this.handleResetClick = this.handleResetClick.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.handleEditTableUpdate = this.handleEditTableUpdate.bind(this);
    this.handleRemoveTable = this.handleRemoveTable.bind(this);
    this.handleTableMove = this.handleTableMove.bind(this);
    this.handleDuplicationOfTable = this.handleDuplicationOfTable.bind(this);
    this.handleJsonUpdate = this.handleJsonUpdate.bind(this);
    this.handleDisagree = this.handleDisagree.bind(this);
    this.togglePreview = this.togglePreview.bind(this);
    this.toggleJsonEditor = this.toggleJsonEditor.bind(this);
    this.handleResetVisualClick = this.handleResetVisualClick.bind(this); // this manages the clicking only not the actual reset
  }

  render() {
    const {
      host, // advancedEditing,
      visualData,
    } = this.props;
    const { isDirty, visualTables, dialog } = this.state;
    // const previewButtonIcon = this.state.hidePreview ? <BsEye /> : <BsEyeSlash />;
    return (
      <div
        className={`advanced-editor ${
          this.state.hidePreview || this.state.jsonEditorOpen
            ? "preview-hidden"
            : ""
        }`}
      >
        <AlertDialog
          open={dialog}
          message={
            "Are sure you want to reset the visual tables? This action is permanent and you will loose your changes."
          }
          handleAgree={this.handleResetClick}
          handleDisagree={this.handleDisagree}
        />
        <EditorHeader
          hidePreview={this.state.hidePreview}
          jsonEditorOpen={this.state.jsonEditorOpen}
          handleTogglePreview={this.togglePreview}
          handleToggleJsonEditor={this.toggleJsonEditor}
        />

        <div className="editor">
          <Typography
            variant="subtitle2"
            style={{ textTransform: "uppercase" }}
            color="secondary"
          >
            {isDirty
              ? "You have unsaved changes. Please save your changes before exiting the advanced editor mode."
              : ""}
          </Typography>
          {this.state.jsonEditorOpen ? (
            <JSONEditor
              visualTables={this.state.visualTables.slice(
                0,
                this.state.visualTables.length + 1
              )}
              onJsonUpdates={this.handleJsonUpdate}
            />
          ) : (
            this.state.visualTables.map((table, tIdx) => {
              return (
                <EditTable
                  key={tIdx}
                  index={tIdx}
                  table={table}
                  onEditTableUpdate={this.handleEditTableUpdate}
                  onRemoveTable={this.handleRemoveTable}
                  dataColumns={visualData.columns}
                  onTableMove={this.handleTableMove}
                  onDuplicationOfTable={this.handleDuplicationOfTable}
                />
              );
            })
          )}
          <div className="editor__bottom-panel">
            <NewTable onAddTable={this.handleAddTableClick} />
            <EditorActions
              totalVisualTables={visualTables.length}
              handleResetVisualClick={this.handleResetVisualClick}
              isDirty={isDirty}
              handleSaveClick={this.handleSaveClick}
            />
          </div>
        </div>
        {!this.state.hidePreview && (
          <ContentDisplay
            host={host}
            visualData={visualData}
            visualTables={this.props.advEditorData.visualTables}
            tableTitleSettings={this.props.tableTitleSettings}
            mainMeasureSettings={this.props.mainMeasureSettings}
            secondaryMeasureSettings={this.props.secondaryMeasureSettings}
            trendLineSettings={this.props.trendLineSettings}
            groupingColumnSettings={this.props.groupingColumnSettings}
            tablesSettings={this.props.tablesSettings}
            selectionManager={this.props.selectionManager}
          />
        )}
      </div>
    );
  }

  private handleResetVisualClick() {
    this.setState({ dialog: true });
  }

  private toggleJsonEditor() {
    this.setState({
      hidePreview: true,
      jsonEditorOpen: !this.state.jsonEditorOpen,
    });
  }

  private togglePreview() {
    this.setState({ hidePreview: !this.state.hidePreview });
  }

  private handleDisagree() {
    this.setState({ dialog: false });
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
    const element = visualTables[tableIndex];
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

  private handleJsonUpdate(visualTables: IVisualTable[]) {
    this.setState({
      isDirty: true,
      visualTables: visualTables,
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

const EditorActions = (props: {
  totalVisualTables: number;
  isDirty: Boolean;
  handleResetVisualClick: Function;
  handleSaveClick: Function;
}) => {
  const disableResetButton = props.totalVisualTables === 0;
  const handleResetClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    props.handleResetVisualClick();
  };
  const handleSaveClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    props.handleSaveClick(e);
  };
  return (
    <div className="editor__actions">
      <Button
        variant="contained"
        disabled={disableResetButton}
        onClick={handleResetClick}
        title="Reset changes to visual"
      >
        Reset
      </Button>

      <Button
        variant="contained"
        color="primary"
        disabled={!props.isDirty}
        onClick={handleSaveClick}
        title="Save Changes"
      >
        Save Changes
      </Button>
    </div>
  );
};

const EditorHeader = (props: {
  hidePreview: Boolean;
  jsonEditorOpen: Boolean;
  handleTogglePreview: Function;
  handleToggleJsonEditor: Function;
}) => {
  const previewButtonIcon = props.hidePreview ? <BsEye /> : <BsEyeSlash />;
  const handleTogglePreview = () => {
    props.handleTogglePreview();
  };
  const handleToggleJsonEditor = () => {
    props.handleToggleJsonEditor();
  };
  return (
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
            startIcon={<BsPencilSquare />}
            onClick={handleToggleJsonEditor}
          >
            {`${props.jsonEditorOpen ? "Close" : "Open"}`} JSON Editor
          </Button>
          <Button
            color="default"
            onClick={handleTogglePreview}
            startIcon={previewButtonIcon}
          >
            {`${props.hidePreview ? "Show" : "Hide"}`} Preview
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};
