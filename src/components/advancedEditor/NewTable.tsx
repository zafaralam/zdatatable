import { Button, TextField, Grid } from "@material-ui/core";
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
    this.handleNewTableNameChange = this.handleNewTableNameChange.bind(this);
  }
  render() {
    const addTableButtonDisabled = this.state.newTableName.length === 0;
    return (
      <div className="editor__new-table">
        <Grid container direction="row" alignItems="flex-end" spacing={1}>
          <Grid item xs={9}>
            <TextField
              name="newTableName"
              label="New Table Name"
              id="newTableName"
              value={this.state.newTableName}
              onChange={this.handleNewTableNameChange}
              size="small"
              fullWidth
              variant="standard"
            />
          </Grid>
          <Grid item xs={3}>
            <Button
              variant="contained"
              color="secondary"
              disabled={addTableButtonDisabled}
              onClick={this.handleAddTable}
            >
              Add New Table
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }

  private handleNewTableNameChange(
    event: React.ChangeEvent<{ value: unknown }>
  ) {
    const _valueToSet = event.target.value as string;
    this.setState({ newTableName: _valueToSet });
  }

  private handleAddTable(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();

    const newTableName = this.state.newTableName;
    this.setState({ newTableName: "" });
    this.props.onAddTable(newTableName);
  }
}
