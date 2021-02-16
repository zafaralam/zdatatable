import * as React from "react";
import powerbi from "powerbi-visuals-api";
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import ILocalizationManager = powerbi.extensibility.ILocalizationManager;
import DataViewObject = powerbi.DataViewObject;

import VisualObjectInstancesToPersist = powerbi.VisualObjectInstancesToPersist;
import { AdvancedEditingSettings } from "../../settings";
import { IVisualData, IVisualTable } from "../../defs/main";
import { ContentDisplay } from "./../ContentDisplay";
import NewTable from "./NewTable";
import EditTable from "./EditTable";

interface IAdvanceEditorProps {
  host: IVisualHost;
  localizationManager: ILocalizationManager;
  advancedEditing: AdvancedEditingSettings;
  advancedEditingObjectMetadata?: DataViewObject;
  visualData: IVisualData;
}

interface IAdvancedEditorState {
  isDirty: boolean;
  visualTables: IVisualTable[];
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
      visualTables: JSON.parse(props.advancedEditing.visualTables)["tables"],
    };

    this.handleAddTableClick = this.handleAddTableClick.bind(this);
    this.handleResetClick = this.handleResetClick.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.handleEditTableUpdate = this.handleEditTableUpdate.bind(this);
  }
  render() {
    const { host, advancedEditing, visualData } = this.props;
    const { isDirty, visualTables } = this.state;
    return (
      <div className="advanced-editor">
        <div className="editor">
          EDITOR
          {visualTables.map((table, tIdx) => {
            return (
              <EditTable
                index={tIdx}
                table={table}
                onEditTableUpdate={this.handleEditTableUpdate}
              />
            );
          })}
          <NewTable onAddTable={this.handleAddTableClick} />
          <br />
          <button
            disabled={visualTables.length === 0}
            onClick={this.handleResetClick}
          >
            Reset Changes
          </button>
          <button disabled={!isDirty} onClick={this.handleSaveClick}>
            Save Changes
          </button>
        </div>
        <hr />
        <ContentDisplay
          host={host}
          visualData={visualData}
          visualTables={advancedEditing.visualTables}
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
      visualTables: visualTables.concat([{ columns: [], name: newTableName }]),
      isDirty: true,
    });
  }

  private handleResetClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();

    const changes = this.getNewObjectInstance();
    this.setState({ visualTables: [] }, () => {
      changes.replace[0].properties["visualTables"] = JSON.stringify({
        tables: [],
      });
      this.props.host.persistProperties(changes);
    });
  }

  private handleSaveClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();

    const changes = this.getNewObjectInstance();
    this.setState({ isDirty: false }, () => {
      changes.replace[0].properties["visualTables"] = JSON.stringify({
        tables: this.state.visualTables,
      });
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
