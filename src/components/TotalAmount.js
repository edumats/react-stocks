import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { integerToReais } from '../helpers/functions';

function TotalAmount(props) {
    return (
       <Card sx={{display: 'inline-block'}}>
        <CardContent>
            <Typography variant="subtitle2" component="h5">Total Carteira</Typography>
            <Typography variant="h5" component="p">{integerToReais(props.cash)}</Typography>
        </CardContent>
       </Card>
    )
}

export default TotalAmount;