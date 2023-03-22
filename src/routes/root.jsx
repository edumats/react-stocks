import { useState } from "react";
import Navbar from "../components/Nav";
import { Outlet } from "react-router-dom";
import TotalAmount from "../components/TotalAmount";
import Box from '@mui/system/Box'
import Container from '@mui/system/Container'

export default function Root() {
    const [cash, setCash] = useState(10_000)
    const [stocks, setStocks] = useState(
        [
            {
                symbol: 'PETR3',
                shortName: 'Petrobras',
                history: [
                    {
                        buy: true,
                        quantity: 5,
                        price: 30,
                        regularMarketTime: "2023-02-16T19:03:01.000Z" 
                    },
                    {
                        buy: true,
                        quantity: 5,
                        price: 30,
                        regularMarketTime: "2023-02-16T19:03:01.000Z" 
                    },
                ]
            },
        ]
    );

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column-reverse', height: '100vh'}}>
            <Navbar />
            <Container sx={{ flexGrow: 4 }}>
                <Outlet context={[stocks, setStocks, cash, setCash]}/>
            </Container>
            <Container sx={{ mt: 2, mb: 4 }}>
                <TotalAmount cash={cash}/>
            </Container>
        </Box>
    )
}