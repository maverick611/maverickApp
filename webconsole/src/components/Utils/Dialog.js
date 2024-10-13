import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { TextField } from '@mui/material';
import './Dialog.css'

const DialogComponent = (props) => {
    const [open, setOpen] = React.useState(props.openDialog);

    const handleYes = () => {
        setOpen(false);
        props.action(props.data);
    };

    const handleNo = () => {
        setOpen(false);
        props.cancel();
    };

    return (
        <Dialog
            open={open}
            fullWidth={true}
            onClose={handleNo}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">
                {props.alertMessage}
            </DialogTitle>
            {props.children}
            {props.data === 'addOptions' ? <DialogContent>
                <span style={{ display: 'flex' }}>
                    <div className='option-add'>Answer:</div>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="answer1"
                        name="answer1"
                        label="Enter possible answer"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                </span>
                <span style={{ display: 'flex' }}>
                    <div className='option-add'>Weight:</div>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="weight1"
                        name="weight1"
                        label="Enter weight of the answer"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                </span>
                <Button className='option-add' onClick={handleNo}>Add Another answer</Button>
            </DialogContent> : null
            }
            <DialogActions>
                <Button onClick={handleNo}>{props.no}</Button>
                <Button onClick={handleYes} autoFocus>
                    {props.yes}
                </Button>
            </DialogActions>
        </Dialog >
    );
}

export default DialogComponent;