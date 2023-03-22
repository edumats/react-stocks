import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box'
import { getTotalQuantity, fetchStockData } from '../helpers/functions';

function StockCard({symbol, shortName, history}) {
    const [currentPrice, setCurrentPrice] = useState(null);
    const totalQuantity = getTotalQuantity(history);
    
    useEffect(() => {
        let { regularMarketPrice } = fetchStockData(symbol);
        setCurrentPrice(regularMarketPrice * 100)
    }, [symbol])

    if (currentPrice === null) {
        return <Card><CardContent>Loading...</CardContent></Card>
    }

    return (
        <Card >
            <CardContent sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <Box>
                    <Typography variant='h5' component='h2'>{symbol}</Typography>
                    <Typography color='textSecondary'>{shortName}</Typography>
                </Box>
                <Box>
                    <Typography variant='body2' component='p'>Quantity: {totalQuantity}</Typography>
                    <Typography variant='body2' component='p'>R$ {(currentPrice * totalQuantity / 100).toFixed(2)}</Typography>
                </Box>
            </CardContent> 
        </Card>
    )
}

export default StockCard;