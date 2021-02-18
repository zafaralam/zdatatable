import * as React from "react";
import {
  EDIT_COLUMNS_PARENT_TYPE,
  VISUAL_DISPLAY_COLUMN_TYPE,
} from "../../defs/enums";
import { IDataColumn, IVisualTableColumn } from "../../defs/main";
import EditTableColumns from "./EditTableColumns";
import {
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Typography,
  DialogTitle,
  TextField,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@material-ui/core";

interface IEditTableColumnProps {
  column: IVisualTableColumn;
  index: number;
  dataColumns: IDataColumn[];
  onVisualColumnUpdate: Function;
  onVisualColumnRemoval: Function;
}
import {
  BsFillTrashFill,
  //   BsPlusSquare,
  BsPencil,
  BsLayoutThreeColumns,
} from "react-icons/bs";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      //   minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  })
);

export default function EditTableColumn(props: IEditTableColumnProps) {
  const classes = useStyles();
  const {
    label,
    columnType,
    queryName,
    dataColumnIndex,
    columns,
  } = props.column;
  const hasColumns = columns && columns.length !== 0,
    columnsAllowed = columnType === VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY,
    dataColumnSet = queryName && queryName.length !== 0;
  const [dialog, setDialog] = React.useState(false);
  const handleDialogOpen = () => {
    setDialog(true);
  };
  const handleDialogClose = () => {
    setDialog(false);
  };
  const handleAddVisualColumn = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    let column: IVisualTableColumn = JSON.parse(JSON.stringify(props.column));
    column.columns.push({
      label: "",
      columnType: VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY,
      queryName: "",
      dataColumnIndex: null,
      columns: [],
    });
    props.onVisualColumnUpdate(column, props.index);
  };

  /**
   * Sends an update about columns within the current column to the parent
   * above.
   * * This function is very important
   * @param columns
   */
  const handleVisualColumnsUpdateOfColumn = (columns: IVisualTableColumn[]) => {
    let _column: IVisualTableColumn = JSON.parse(JSON.stringify(props.column));
    _column.columns = columns;

    props.onVisualColumnUpdate(_column, props.index);
  };

  const handleColumnPropertyChange = (property: string, value: any) => {
    const _column = JSON.parse(JSON.stringify(props.column));

    _column[property] = value;

    props.onVisualColumnUpdate(_column, props.index);
  };

  const handleColumnTypeChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const _valueToSet = event.target.value as VISUAL_DISPLAY_COLUMN_TYPE;
    const _column: IVisualTableColumn = JSON.parse(
      JSON.stringify(props.column)
    );
    _column["columnType"] = _valueToSet;

    /**
     * * Extra protection in case a user does change the column type
     */
    if (_valueToSet === VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY) {
      _column.queryName = "";
      _column.dataColumnIndex = null;
      _column["columns"] = [];
    } else {
      // for a non-display only column a user cannot add sub column.
      _column["columns"] = [];
    }
    props.onVisualColumnUpdate(_column, props.index);
  };

  const handleMeasureSelectionChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const _valueToSet = event.target.value as string;
    const _column: IVisualTableColumn = JSON.parse(
      JSON.stringify(props.column)
    );
    _column.queryName = _valueToSet;
    _column.dataColumnIndex = props.dataColumns.findIndex(
      (i) => i.queryName === _valueToSet
    );

    props.onVisualColumnUpdate(_column, props.index);
  };

  return (
    <div key={props.index} className="edit-table__column">
      <span style={{ maxWidth: "180px", display: "inline-block" }}>
        {label.length === 0
          ? columnType === VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY
            ? "Column"
            : "Measure"
          : label}
      </span>
      <IconButton
        aria-label="edit"
        onClick={handleDialogOpen}
        style={{ fontSize: "1rem" }}
      >
        <BsPencil />
      </IconButton>
      <IconButton
        style={{ color: "#a50d0d", fontSize: "1rem" }}
        aria-label="edit"
        title="Remove Column"
        onClick={() => {
          props.onVisualColumnRemoval(props.index);
        }}
      >
        <BsFillTrashFill />
      </IconButton>

      <Dialog
        open={dialog}
        onClose={handleDialogClose}
        disableBackdropClick
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {label.length === 0
            ? columnType === VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY
              ? "Column"
              : "Measure Column"
            : label}
        </DialogTitle>
        <DialogContent>
          <div>
            <FormControl className={classes.formControl} fullWidth>
              <TextField
                autoFocus
                margin="dense"
                fullWidth
                label="Column Name (Label to display)"
                value={label}
                onChange={(e) => {
                  handleColumnPropertyChange("label", e.target.value);
                }}
              />
            </FormControl>
          </div>
          <div>
            <FormControl className={classes.formControl} fullWidth>
              <InputLabel id="col-type-label">Column Type</InputLabel>
              <Select
                labelId="col-type-label"
                value={columnType}
                label="Column Type"
                onChange={handleColumnTypeChange}
                fullWidth
              >
                <MenuItem value={VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY}>
                  Display Only
                </MenuItem>
                <MenuItem value={VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_MAIN}>
                  Main Measure
                </MenuItem>
                <MenuItem
                  value={VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_SECONDARY}
                >
                  Secondary Measure
                </MenuItem>
                <MenuItem value={VISUAL_DISPLAY_COLUMN_TYPE.TREND_CHART}>
                  Trend Chart
                </MenuItem>
              </Select>
            </FormControl>
          </div>
          {columnType !== VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY ? (
            <div>
              <FormControl className={classes.formControl} fullWidth>
                <InputLabel id="select-measure-label">
                  Measure to display
                </InputLabel>
                <Select
                  labelId="select-measure-label"
                  value={queryName}
                  onChange={handleMeasureSelectionChange}
                  fullWidth
                >
                  {props.dataColumns
                    .filter((i) => i.content === true)
                    .map((dc) => {
                      return (
                        <MenuItem value={dc.queryName}>
                          {dc.displayName}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
            </div>
          ) : (
            <Grid
              container
              alignItems="baseline"
              spacing={2}
              style={{ marginLeft: "5px", marginTop: "5px" }}
            >
              <Grid item>
                <Typography variant="body1" gutterBottom>
                  Sub columns: {columns && columns.length}
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  onClick={handleAddVisualColumn}
                  startIcon={<BsLayoutThreeColumns />}
                >
                  Add Sub Column
                </Button>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* 

      <IconButton
        title="Add Column"
        aria-label="add column"
        onClick={handleAddVisualColumn}
      >
        <BsPlusSquare />
      </IconButton> */}
      {columnsAllowed && hasColumns ? (
        <EditTableColumns
          dataColumns={props.dataColumns}
          visualColumns={columns}
          parentType={EDIT_COLUMNS_PARENT_TYPE.COLUMN}
          onVisualColumnsUpdateOfColumn={handleVisualColumnsUpdateOfColumn}
        />
      ) : (
        ""
      )}
    </div>
  );
}
