import { useOutletContext } from 'react-router-dom';
import StockCard from '../components/Card';

export default function Portfolio() {
    const [stocks] = useOutletContext();
    return(
        <>
            { stocks ? stocks.map(
                stock => <StockCard
                          key={stock.symbol} 
                          symbol={stock.symbol}
                          shortName={stock.shortName}
                          history={stock.history}
                          />) : "Sem ativos"}

        </>
    )
}

