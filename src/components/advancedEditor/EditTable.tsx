// TODO: style the component

import * as React from "react";
import { IVisualTable, IVisualTableColumn } from "../../defs/main";

interface IEditTableProps {
  table: IVisualTable;
  index: number;
  onEditTableUpdate: Function;
}

interface IEditTableState {
  name: string;
  // columns: IVisualTableColumn[];
}

export default class EditTable extends React.Component<
  IEditTableProps,
  IEditTableState
> {
  constructor(props: IEditTableProps) {
    super(props);
    this.state = {
      name: this.props.table.name,
      // columns: this.props.table.columns
    };

    this.handleTableNameChange = this.handleTableNameChange.bind(this);
  }

  private handleTableNameChange(value) {
    // let _table: IVisualTable = JSON.parse(JSON.stringify(this.props.table));

    // _table.name = value;

    this.props.onEditTableUpdate(
      { name: value, columns: this.props.table.columns },
      this.props.index
    );
  }

  render() {
    // const { name, columns } = this.state;

    return (
      <div className="edit-table" key={this.props.index}>
        <div className="edit-table__table-name">
          <label>Table Name:</label>
          <input
            type="text"
            value={this.state.name}
            onChange={(e) => {
              this.setState({ name: e.target.value });
              this.handleTableNameChange(e.target.value);
            }}
          />
        </div>
      </div>
    );
  }
}
