// TODO: style the component

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
  }
  render() {
    return (
      <div className="editor__new-table">
        <Grid container direction="row" alignItems="flex-end" spacing={1}>
          <Grid item xs={9}>
            <TextField
              name="newTableName"
              label="New Table Name"
              id="newTableName"
              value={this.state.newTableName}
              onChange={(e) => {
                this.setState({ newTableName: e.target.value });
              }}
              size="small"
              fullWidth
              variant="standard"
            />
          </Grid>
          <Grid item xs={3}>
            <Button
              variant="contained"
              color="secondary"
              disabled={this.state.newTableName.length === 0}
              onClick={this.handleAddTable}
            >
              Add New Table
            </Button>
          </Grid>
        </Grid>
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
