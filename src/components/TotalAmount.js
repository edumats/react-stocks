import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

function TotalAmount(props) {
    return (
       <Card sx={{width: "50%"}}>
        <CardContent>
            <Typography variant="subtitle2" component="h5">Total Carteira</Typography>
            <Typography variant="h5" component="p">R$ {(props.cash / 100).toFixed(2)}</Typography>
        </CardContent>
       </Card>
    )
}

export default TotalAmount;