import * as React from "react";
import powerbi from "powerbi-visuals-api";
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import ILocalizationManager = powerbi.extensibility.ILocalizationManager;
import DataViewObject = powerbi.DataViewObject;

import VisualObjectInstancesToPersist = powerbi.VisualObjectInstancesToPersist;
import { AdvancedEditingSettings } from "../settings";
import { IVisualData, IVisualTable } from "../defs/main";
import { ContentDisplay } from "./ContentDisplay";

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
    this.handleSaveClick = this.handleSaveClick.bind(this);
  }
  render() {
    const { host, advancedEditing, visualData } = this.props;
    const { isDirty } = this.state;
    return (
      <div className="advanceEditor">
        <div className="editor">
          This is the editor
          <button onClick={this.handleAddTableClick}>Add Table</button>
          <br />
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
  private handleAddTableClick(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();

    const visualTables = this.state.visualTables.slice(
      0,
      this.state.visualTables.length + 1
    );

    this.setState({
      visualTables: visualTables.concat([{ columns: [] }]),
      isDirty: true,
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
