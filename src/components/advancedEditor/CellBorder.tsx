import * as React from "react";

import {
  Grid,
  InputLabel,
  FormControl,
  Typography,
  TextField,
  Select,
  MenuItem,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { VisualConstants } from "./../../VisualConstants";
import ColorPicker from "./ColorPicker";

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

interface ICellBorderProps {
  side: string;
  border: string;
  onBorderUpdate: Function;
}

export default function CellBorder(props: ICellBorderProps) {
  const classes = useStyles();
  const { side, border } = props;
  let borderComponents;

  if (border !== undefined && border !== null) {
    if (border === "none") {
      borderComponents = VisualConstants.visualTableColumn.border[
        side === "all" ? "left" : side
      ].split(" ");
      borderComponents[0] = 0;
    } else {
      borderComponents = border.split(" ");
      borderComponents[0] =
        parseInt(borderComponents[0].replace(/px/, "")) || 0;
    }
  } else {
    borderComponents = VisualConstants.visualTableColumn.border[
      side === "all" ? "left" : side
    ].split(" ");
  }
  const width = borderComponents[0],
    style = borderComponents[1],
    color = borderComponents[2];

  const handleBorderWidthChange = (borderWidth: number) => {
    props.onBorderUpdate(side, `${borderWidth}px ${style} ${color}`);
  };
  const handleBorderStyleChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const _valueToSet = event.target.value as string;
    props.onBorderUpdate(side, `${width}px ${_valueToSet} ${color}`);
  };
  const handleBorderColorChange = (borderColor: string) => {
    props.onBorderUpdate(side, `${width}px ${style} ${borderColor}`);
  };

  return (
    <Grid
      container
      className={classes.formControl}
      direction="row"
      alignItems="center"
      spacing={1}
    >
      <Grid item xs={2}>
        <Typography variant="body2">
          {" "}
          {side[0].toUpperCase() + side.substring(1)}
        </Typography>
      </Grid>

      <Grid item xs={3}>
        <TextField
          margin="dense"
          size="small"
          label="Width (px)"
          type="number"
          value={width}
          onChange={(e) => {
            handleBorderWidthChange(parseInt(e.target.value) || 0);
          }}
        ></TextField>
      </Grid>
      <Grid item xs={3}>
        <InputLabel id={`select-border-style-${side}`}></InputLabel>
        <Select
          label="Style"
          labelId={`select-border-style-${side}`}
          value={style}
          onChange={handleBorderStyleChange}
          fullWidth
        >
          <MenuItem value="none">None</MenuItem>
          <MenuItem value="solid">Solid</MenuItem>
          <MenuItem value="double">Double</MenuItem>
          <MenuItem value="dashed">Dashed</MenuItem>
          <MenuItem value="dotted">Dotted</MenuItem>
          <MenuItem value="groove">Groove</MenuItem>
        </Select>
      </Grid>
      <Grid item xs={1}>
        <ColorPicker
          color={color}
          onColorChange={(bColor) => {
            handleBorderColorChange(bColor);
          }}
        />
      </Grid>
    </Grid>
  );
}
