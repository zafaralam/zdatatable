import { Grid, TextField } from "@material-ui/core";
import * as React from "react";
import { SketchPicker } from "react-color";
import { render } from "react-dom";

interface IColorPickerProps {
  color: string;
  onColorChange: Function;
}

export default function ColorPicker(props: IColorPickerProps) {
  const colorStyles: React.CSSProperties = {
      width: "36px",
      height: "14px",
      borderRadius: "2px",
      background: props.color,
    },
    swatchStyles: React.CSSProperties = {
      padding: "5px",
      background: "#fff",
      borderRadius: "1px",
      boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
      display: "inline-block",
      cursor: "pointer",
    },
    popoverStyles: React.CSSProperties = {
      position: "absolute",
      zIndex: 10,
    },
    coverStyles: React.CSSProperties = {
      position: "fixed",
      top: "0px",
      right: "0px",
      bottom: "0px",
      left: "0px",
    };

  const [openColorPicker, setOpenColorPicker] = React.useState(false);

  const handleOpenColorPicker = () => {
    setOpenColorPicker(true);
  };

  const handleCloseColorPicker = () => {
    setOpenColorPicker(false);
  };

  const handleColorPickerChange = (color) => {
    // console.log(color);
    props.onColorChange(color.hex);
  };

  return (
    <div>
      <Grid container direction="row">
        <Grid item>
          <div style={swatchStyles} onClick={handleOpenColorPicker}>
            <div style={colorStyles} />
          </div>
        </Grid>
        <Grid item>
          <TextField
            size="small"
            value={props.color}
            onChange={(e) => {
              const color = e.target.value;
              props.onColorChange(
                color && color.length !== 0 && color[0] === "#"
                  ? color
                  : `#${color}`
              );
            }}
          ></TextField>
        </Grid>
      </Grid>
      {openColorPicker ? (
        <div style={popoverStyles}>
          <div style={coverStyles} onClick={handleCloseColorPicker} />
          <SketchPicker
            color={props.color}
            onChange={handleColorPickerChange}
          />
        </div>
      ) : null}
    </div>
  );
}
