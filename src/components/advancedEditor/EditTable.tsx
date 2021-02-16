// TODO: style the component

import * as React from "react";
import { VISUAL_DISPLAY_COLUMN_TYPE } from "../../defs/enums";
import { IVisualTable, IVisualTableColumn } from "../../defs/main";

interface IEditTableProps {
  table: IVisualTable;
  index: number;
  onEditTableUpdate: Function;
  onRemoveTable: Function;
}

interface IEditTableState {
  //   name: string;
  // columns: IVisualTableColumn[];
}

export default class EditTable extends React.Component<
  IEditTableProps,
  IEditTableState
> {
  constructor(props: IEditTableProps) {
    super(props);

    this.handleTableNameChange = this.handleTableNameChange.bind(this);
    this.handleAddColumn = this.handleAddColumn.bind(this);
    this.handleRemoveTable = this.handleRemoveTable.bind(this);
  }

  private handleTableNameChange(value) {
    this.props.onEditTableUpdate(
      { name: value, columns: this.props.table.columns },
      this.props.index
    );
  }

  private handleRemoveTable(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();

    this.props.onRemoveTable(this.props.index);
  }

  private handleAddColumn(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();

    this.props.onEditTableUpdate(
      {
        name: this.props.table.name,
        columns: this.props.table.columns
          .slice(0, this.props.table.columns.length + 1)
          .concat([
            {
              label: "",
              displayOnly: VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY,
              queryName: "",
              dataColumnIndex: null,
              columns: [],
            },
          ]),
      },
      this.props.index
    );
  }

  render() {
    // const { name, columns } = this.state;

    return (
      <div className="edit-table" key={`edit-table-${this.props.index}`}>
        <div className="edit-table__table-name">
          <label>Table Name:</label>
          <input
            type="text"
            value={this.props.table.name}
            onChange={(e) => {
              this.handleTableNameChange(e.target.value);
            }}
          />
          <span>
            <button onClick={this.handleRemoveTable}>Remove Table</button>
          </span>
          <span>
            <button onClick={this.handleAddColumn}>Add Column</button>
          </span>
        </div>
        <div className="edit-table__columns">
          {this.props.table.columns.map((column, cIdx) => {
            return (
              <div className="edit-table__column" key={cIdx}>
                {`${column.label}-${cIdx}`}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
