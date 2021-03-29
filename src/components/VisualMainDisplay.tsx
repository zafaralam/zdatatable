// import { timeHours } from "d3";
import * as React from "react";
import Debugger from "../debug/Debugger";
import { VisualSettings } from "../settings";
import {
  IVisualMainDisplayProps,
  IVisualMainDisplayState,
  IVisualValueData,
} from "./../defs/main";
import { processDataView } from "./../utils/dataView";
import AdvanceEditor from "./advancedEditor/AdvancedEditor";
import { ContentDisplay } from "./ContentDisplay";
// export interface State {}

const defaultSettings = VisualSettings.getDefault();

export const initialState: IVisualMainDisplayState = {
  isEditMode: false,
  canAdvanceEdit: false,
  advancedEditing: defaultSettings["advancedEditing"],
  data: processDataView([], [], null),
  tableTitleSettings: defaultSettings["tableTileSettings"],

  mainMeasureSettings: defaultSettings["mainMeasureSettings"],
  secondaryMeasureSettings: defaultSettings["secondaryMeasureSettings"],
  trendLineSettings: defaultSettings["trendLineSettings"],
  groupingColumnSettings: defaultSettings["groupingColumnSettings"],
  tablesSettings: defaultSettings["tablesSettings"],
  // visualTables: [],
};

export class VisualMainDisplay extends React.Component<
  IVisualMainDisplayProps,
  IVisualMainDisplayState
> {
  private static updateCallback: (data: object) => void = null;
  private static updateDataCallback: (data: object) => void = null;
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

    VisualMainDisplay.updateDataCallback = (
      newData: IVisualValueData
    ): void => {
      this.setState({ data: newData });
    };
  }

  public componentWillUnmount() {
    VisualMainDisplay.updateCallback = null;
    VisualMainDisplay.updateDataCallback = null;
  }

  public static update(newState: IVisualMainDisplayState) {
    if (typeof VisualMainDisplay.updateCallback === "function") {
      VisualMainDisplay.updateCallback(newState);
    }
  }

  public static updateData(newData: IVisualValueData) {
    if (typeof VisualMainDisplay.updateDataCallback === "function") {
      VisualMainDisplay.updateDataCallback(newData);
    }
  }

  private conditionalRendering() {
    const {
      isEditMode,
      // updateOptions,
      advancedEditing,
      objectMetadata,
      data,
      tableTitleSettings,
      mainMeasureSettings,
      secondaryMeasureSettings,
      trendLineSettings,
      groupingColumnSettings,
      tablesSettings,
      canAdvanceEdit,
    } = this.state;

    switch (true) {
      case isEditMode: {
        return (
          <AdvanceEditor
            host={this.props.host}
            localizationManager={this.props.localizationManager}
            advancedEditing={advancedEditing}
            advancedEditingObjectMetadata={objectMetadata?.advancedEditing}
            visualData={data.visualData || { columns: [], values: [] }}
            advEditorData={this.props.advEditorData}
            tableTitleSettings={tableTitleSettings}
            mainMeasureSettings={mainMeasureSettings}
            secondaryMeasureSettings={secondaryMeasureSettings}
            trendLineSettings={trendLineSettings}
            groupingColumnSettings={groupingColumnSettings}
            tablesSettings={tablesSettings}
            selectionManager={this.props.selectionManager}
            // updateDisplayTables={this.props.updateDisplayTables}
            // visualTables={this.state.visualTables}
          />
        );
      }

      case data.isDataViewValid: {
        return (
          <ContentDisplay
            host={this.props.host}
            visualData={data.visualData || { columns: [], values: [] }}
            visualTables={this.props.advEditorData.visualTables}
            tableTitleSettings={tableTitleSettings}
            mainMeasureSettings={mainMeasureSettings}
            secondaryMeasureSettings={secondaryMeasureSettings}
            trendLineSettings={trendLineSettings}
            groupingColumnSettings={groupingColumnSettings}
            tablesSettings={tablesSettings}
            selectionManager={this.props.selectionManager}
          />
        );
      }
      case canAdvanceEdit && !data.isDataViewValid: {
        return (
          <div className="starter-message">
            <h4>z-DataTable</h4>
            <div>
              <p>Thanks for using this visual and providing your support!</p>
              <p>To get started follow the below steps:</p>

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
        );
      }
      default:
        return "Loading....";
    }
  }

  render() {
    const { updateOptions } = this.state;
    Debugger.LOG(this.state);
    const style: React.CSSProperties = {
      width: updateOptions && updateOptions.viewport.width,
      height: updateOptions && updateOptions.viewport.height,
    };

    return (
      <div className="main-container" style={style}>
        {this.conditionalRendering()}
      </div>
    );
  }
}
