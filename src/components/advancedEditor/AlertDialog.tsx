import * as React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

interface IAlertDialogProps {
  open: boolean;
  message: string;
  handleDisagree: Function;
  handleAgree: Function;
}

export default function AlertDialog(props: IAlertDialogProps) {
  //     const [open, setOpen] = React.useState(false);

  //     if(prop)

  //   const handleClickOpen = () => {
  //     setOpen(true);
  //   };

  const handleDisagree = () => {
    props.handleDisagree();
  };

  const handleAgree = () => {
    props.handleAgree();
  };

  return (
    <Dialog
      open={props.open}
      onClose={handleDisagree}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"z-Data Table"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {props.message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDisagree}>Disagree</Button>
        <Button onClick={handleAgree} color="primary" autoFocus>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
}
