// TODO: style the component

import * as React from "react";

interface INewTableProps {
  onAddTable: Function;
}

interface INewTableState {
  newTableName: string;
}
export default class NewTable extends React.Component<
  INewTableProps,
  INewTableState
> {
  constructor(props: INewTableProps) {
    super(props);
    this.state = {
      newTableName: "",
    };

    this.handleAddTable = this.handleAddTable.bind(this);
  }
  render() {
    return (
      <div>
        <input
          type="text"
          name="newTableName"
          id="newTableName"
          value={this.state.newTableName}
          onChange={(e) => {
            this.setState({ newTableName: e.target.value });
          }}
        />
        <button
          disabled={this.state.newTableName.length === 0}
          onClick={this.handleAddTable}
        >
          Add New Table
        </button>
      </div>
    );
  }

  private handleAddTable(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();

    const newTableName = this.state.newTableName;
    this.setState({ newTableName: "" });
    this.props.onAddTable(newTableName);
  }
}
