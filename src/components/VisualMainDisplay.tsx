import { timeHours } from "d3";
import * as React from "react";
import { VisualSettings } from "../settings";
import {
  IVisualMainDisplayProps,
  IVisualMainDisplayState,
} from "./../defs/main";
import { processDataView } from "./../utils/dataView";
import AdvanceEditor from "./AdvancedEditor";
import { ContentDisplay } from "./ContentDisplay";
// export interface State {}

const defaultSettings = VisualSettings.getDefault();

export const initialState: IVisualMainDisplayState = {
  isEditMode: false,
  canAdvanceEdit: false,
  advancedEditing: defaultSettings["advancedEditing"],
  data: processDataView([], []),
};

export class VisualMainDisplay extends React.Component<
  IVisualMainDisplayProps,
  IVisualMainDisplayState
> {
  private static updateCallback: (data: object) => void = null;
  public state: IVisualMainDisplayState = initialState;

  constructor(props: any) {
    super(props);
    this.state = initialState;
  }

  public componentDidMount() {
    VisualMainDisplay.updateCallback = (
      newState: IVisualMainDisplayState
    ): void => {
      this.setState(newState);
    };
  }

  public componentWillUnmount() {
    VisualMainDisplay.updateCallback = null;
  }

  public static update(newState: IVisualMainDisplayState) {
    if (typeof VisualMainDisplay.updateCallback === "function") {
      VisualMainDisplay.updateCallback(newState);
    }
  }

  private conditionalRendering() {
    const {
      isEditMode,
      // updateOptions,
      advancedEditing,
      objectMetadata,
      data,
    } = this.state;
    switch (true) {
      case isEditMode: {
        return (
          <AdvanceEditor
            host={this.props.host}
            localizationManager={this.props.localizationManager}
            advancedEditing={advancedEditing}
            advancedEditingObjectMetadata={objectMetadata?.advancedEditing}
            visualData={data.visualData}
          />
        );
      }

      case data.isDataViewValid: {
        return (
          <ContentDisplay
            host={this.props.host}
            visualData={data.visualData}
            visualTables={advancedEditing.visualTables}
          />
        );
      }

      default:
        return <div className="empty">Nothing to display</div>;
    }
  }

  render() {
    return <div className="main-container">{this.conditionalRendering()}</div>;
  }
}