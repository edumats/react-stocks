import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';

export default function AlertManager(props) {
    const handleClose = () => {
        props.setSnackBar({message: '', severity: props.snackbar.severity});
    }

    return (
        <Snackbar
            open={Boolean(props.snackbar.message)}
            autoHideDuration={6000}
            onClose={handleClose}
            TransitionComponent={Slide}
        >
            <Alert
                severity={props.snackbar.severity}
                variant="filled"
                onClose={handleClose}
            >
                {props.snackbar.message}
            </Alert>
        </Snackbar>
    )
}