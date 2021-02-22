import * as React from "react";
import { EDIT_COLUMNS_PARENT_TYPE, MOVE_DIRECTION } from "../../defs/enums";
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
    this.handleColumnMove = this.handleColumnMove.bind(this);
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

  private handleColumnMove(direction: MOVE_DIRECTION, columnIndex: number) {
    if (
      (direction === MOVE_DIRECTION.LEFT && columnIndex === 0) ||
      (direction === MOVE_DIRECTION.RIGHT &&
        columnIndex === this.props.visualColumns.length - 1)
    ) {
      return;
    }

    const toIndex =
      direction === MOVE_DIRECTION.LEFT ? columnIndex - 1 : columnIndex + 1;
    console.log(MOVE_DIRECTION[direction].toString(), columnIndex, toIndex);
    let visualColumns = this.props.visualColumns.slice(
      0,
      this.props.visualColumns.length + 1
    );
    var element = visualColumns[columnIndex];
    visualColumns.splice(columnIndex, 1);
    visualColumns.splice(toIndex, 0, element);

    if (this.props.parentType === EDIT_COLUMNS_PARENT_TYPE.TABLE) {
      this.props.onVisualColumnsUpdate(visualColumns);
    } else {
      this.props.onVisualColumnsUpdateOfColumn(visualColumns);
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
          onColumnMove={this.handleColumnMove}
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
