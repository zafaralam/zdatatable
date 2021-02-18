import * as React from "react";
import { EDIT_COLUMNS_PARENT_TYPE } from "../../defs/enums";
import { IDataColumn, IVisualTableColumn } from "../../defs/main";
import EditTableColumn from "./EditTableColumn";

interface IEditTableColumnsProps {
  visualColumns: IVisualTableColumn[];
  dataColumns: IDataColumn[];
  parentType: EDIT_COLUMNS_PARENT_TYPE;
  onVisualColumnsUpdate?: Function;
  onVisualColumnsUpdateOfColumn?: Function;
}

export default class EditTableColumns extends React.Component<IEditTableColumnsProps> {
  constructor(props) {
    super(props);
    this.handleVisualColumnUpdate = this.handleVisualColumnUpdate.bind(this);
    this.handleVisualColumnRemoval = this.handleVisualColumnRemoval.bind(this);
  }

  private handleVisualColumnUpdate(column: IVisualTableColumn, index: number) {
    let _vCols = this.props.visualColumns.slice(
      0,
      this.props.visualColumns.length + 1
    );
    _vCols[index] = JSON.parse(JSON.stringify(column));

    if (this.props.parentType === EDIT_COLUMNS_PARENT_TYPE.TABLE) {
      this.props.onVisualColumnsUpdate(_vCols);
    } else {
      this.props.onVisualColumnsUpdateOfColumn(_vCols);
    }
  }

  private handleVisualColumnRemoval(index: number) {
    let _vCols = this.props.visualColumns.slice(
      0,
      this.props.visualColumns.length + 1
    );

    _vCols.splice(index, 1);

    if (this.props.parentType === EDIT_COLUMNS_PARENT_TYPE.TABLE) {
      this.props.onVisualColumnsUpdate(_vCols);
    } else {
      this.props.onVisualColumnsUpdateOfColumn(_vCols);
    }
  }

  render() {
    const tableColumns = this.props.visualColumns.map((column, cIdx) => {
      return (
        <EditTableColumn
          column={column}
          index={cIdx}
          dataColumns={this.props.dataColumns}
          onVisualColumnUpdate={this.handleVisualColumnUpdate}
          onVisualColumnRemoval={this.handleVisualColumnRemoval}
        />
      );
    });
    const { parentType } = this.props;
    return (
      <div
        className={`edit-table__columns edit-table__columns--${
          parentType === EDIT_COLUMNS_PARENT_TYPE.TABLE ? "table" : "column"
        }`}
      >
        {tableColumns}
      </div>
    );
  }
}
