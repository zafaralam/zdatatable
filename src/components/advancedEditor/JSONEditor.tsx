import * as React from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";

import { IVisualTable } from "./../../defs/main";
import { Button, Typography, Grid } from "@material-ui/core";

interface IJSONEditorProps {
  visualTables: IVisualTable[];
  onJsonUpdates: Function;
}

export default function JSONEditor(props: IJSONEditorProps) {
  const [jsonText, setJsonText] = React.useState(
    JSON.stringify({ tables: props.visualTables }, null, 2)
  );
  const [hasError, setHasError] = React.useState(false);

  const handleChange = (newValue: any) => {
    setJsonText(newValue);
  };
  const applyChanges = () => {
    try {
      const tables: IVisualTable[] = JSON.parse(jsonText);
      props.onJsonUpdates(tables);
      setHasError(false);
    } catch (error) {
      setHasError(true);
      console.log("Json is not correct.");
    }
  };

  return (
    <Grid container direction="column" style={{ height: "90%" }}>
      <Grid item xs={11}>
        <Typography variant="overline" color="secondary">
          {hasError
            ? "Error converting json text. Please review the json text and apply changes again."
            : ""}
        </Typography>
        <AceEditor
          height="100%"
          width="90%"
          mode="json"
          theme="github"
          value={jsonText}
          name="jsonEditor"
          readOnly
          onChange={handleChange}
          showPrintMargin={false}
          editorProps={{ $blockScrolling: true }}
          debounceChangePeriod={500}
        />
      </Grid>
      <Grid
        container
        direction="row"
        item
        alignItems="flex-end"
        justify="flex-end"
        xs={1}
      >
        <Grid item>
          {/* <Button color="primary" onClick={applyChanges} variant="contained">
            Apply Changes
          </Button> */}
        </Grid>
      </Grid>
    </Grid>
  );
}
