// TODO: style the component

import * as React from "react";
import {
  Button,
  Grid,
  Paper,
  //Card, CardContent,
  TextField,
  Checkbox,
  ButtonGroup,
  IconButton,
} from "@material-ui/core";

import {
  BsFillTrashFill,
  BsLayoutThreeColumns,
  // BsPlusSquare,
  // BsGear,
  BsChevronDown,
  BsChevronUp,
  BsChevronRight,
  BsChevronLeft,
} from "react-icons/bs";
import {
  EDIT_COLUMNS_PARENT_TYPE,
  // VISUAL_DISPLAY_COLUMN_TYPE,
  MOVE_DIRECTION,
} from "../../defs/enums";
import { IVisualTable, IDataColumn, IVisualTableColumn } from "../../defs/main";
import EditTableColumns from "./EditTableColumns";
import { VisualConstants } from "./../../VisualConstants";

interface IEditTableProps {
  table: IVisualTable;
  index: number;
  dataColumns: IDataColumn[];
  onEditTableUpdate: Function;
  onRemoveTable: Function;
  onTableMove: Function;
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
    this.handleVisualColumnsUpdate = this.handleVisualColumnsUpdate.bind(this);
    this.handleShowTableTitleChange = this.handleShowTableTitleChange.bind(
      this
    );
    this.handleTableFullWidthChange = this.handleTableFullWidthChange.bind(
      this
    );
    this.handleTableMove = this.handleTableMove.bind(this);
  }

  private handleTableMove(direction: MOVE_DIRECTION) {
    this.props.onTableMove(direction, this.props.index);
  }

  private handleTableNameChange(value) {
    this.props.onEditTableUpdate(
      { name: value, columns: this.props.table.columns, showTitle: value },
      this.props.index
    );
  }

  private handleShowTableTitleChange(value) {
    this.props.onEditTableUpdate(
      { ...this.props.table, showTitle: value },
      this.props.index
    );
  }

  private handleTableFullWidthChange(value) {
    this.props.onEditTableUpdate(
      { ...this.props.table, fullWidth: value },
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
        showTitle: this.props.table.showTitle,
        fullWidth: this.props.table.fullWidth,
        columns: this.props.table.columns
          .slice(0, this.props.table.columns.length + 1)
          .concat([
            {
              ...VisualConstants.visualTableColumn,
              dataColumnIndex: null,
              level: 1,
              bgColor: VisualConstants.baseColumnBgColor,
              textColor: VisualConstants.baseColumnTextColor,
            },
          ]),
        totalTableColumns: 0,
      },
      this.props.index
    );
  }

  private handleVisualColumnsUpdate(columns: IVisualTableColumn[]) {
    this.props.onEditTableUpdate(
      {
        name: this.props.table.name,
        columns: columns,
        showTitle: this.props.table.showTitle,
        fullWidth: this.props.table.fullWidth,
      },
      this.props.index
    );
  }

  render() {
    // const { name, columns } = this.state;

    return (
      <Paper variant="outlined" style={{ marginBottom: "5px" }}>
        <div className="edit-table" key={`edit-table-${this.props.index}`}>
          <div className="edit-table__table-name">
            <Grid container direction="row" alignItems="flex-end" spacing={1}>
              <Grid container direction="row" item xs={6}>
                <Grid item xs={1}>
                  <ButtonGroup
                    orientation="vertical"
                    size="small"
                    variant="outlined"
                    aria-label="small outlined button group"
                  >
                    <IconButton
                      title="Move table above"
                      onClick={() => {
                        this.handleTableMove(MOVE_DIRECTION.UP);
                      }}
                    >
                      <BsChevronUp />
                    </IconButton>

                    <IconButton
                      title="Move table down"
                      onClick={() => {
                        this.handleTableMove(MOVE_DIRECTION.DOWN);
                      }}
                    >
                      <BsChevronDown />
                    </IconButton>
                  </ButtonGroup>
                </Grid>
                <Grid item xs={11}>
                  <TextField
                    id={`editTableName-${this.props.index}`}
                    label="Table Name"
                    value={this.props.table.name}
                    onChange={(e) => {
                      this.handleTableNameChange(e.target.value);
                    }}
                    size="small"
                    fullWidth
                    variant="standard"
                  />
                </Grid>
              </Grid>
              <Grid item xs={2}>
                <Checkbox
                  checked={this.props.table.showTitle}
                  onChange={(e) => {
                    this.handleShowTableTitleChange(e.target.checked);
                  }}
                  inputProps={{ "aria-label": "primary checkbox" }}
                />
                <span> Show Title?</span>
              </Grid>
              {/* <Grid item xs={2}> */}
              {/* // * Removing for now 
                  // ? Would need to think of a way of doing this when using with width
                */}
              {/* <Checkbox
                  checked={this.props.table.fullWidth}
                  onChange={(e) => {
                    this.handleTableFullWidthChange(e.target.checked);
                  }}
                  inputProps={{ "aria-label": "primary checkbox" }}
                />
                <span>Make table full width?</span> */}
              {/* </Grid> */}
              <Grid
                container
                direction="row"
                item
                xs={4}
                spacing={1}
                justify="flex-end"
                alignItems="center"
              >
                <Button
                  color="primary"
                  onClick={this.handleAddColumn}
                  startIcon={<BsLayoutThreeColumns />}
                  title="Add a base column to the table"
                >
                  Add Base Column
                </Button>
                <Button
                  style={{ color: "#a50d0d" }}
                  onClick={this.handleRemoveTable}
                  startIcon={<BsFillTrashFill />}
                  title="Remove table from visual"
                >
                  Remove Table
                </Button>
              </Grid>
            </Grid>
          </div>
          <EditTableColumns
            dataColumns={this.props.dataColumns}
            visualColumns={this.props.table.columns}
            parentType={EDIT_COLUMNS_PARENT_TYPE.TABLE}
            onVisualColumnsUpdate={this.handleVisualColumnsUpdate}
          />
        </div>
      </Paper>
    );
  }
}
