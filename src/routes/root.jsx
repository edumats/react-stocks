import { useState } from "react";
import { Outlet } from "react-router-dom";
import Box from '@mui/system/Box'
import Container from '@mui/system/Container'
import Navbar from "../components/Nav";
import Button from '@mui/material/Button'
import AlertManager from "../components/Alert";
import TotalAmount from "../components/TotalAmount";

export default function Root() {
    // Using integers to store monetary value
    const [cash, setCash] = useState(1_000_000)
    const [snackbar, setSnackBar] = useState({message: '', severity: 'success'})
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
            <Button onClick={() => setSnackBar({message:'Hi', severity:'success'})}>Click</Button>
            <AlertManager snackbar={snackbar} setSnackBar={setSnackBar}/>
            <Container sx={{ flexGrow: 4 }}>
                <Outlet 
                    context={[stocks, setStocks, cash, setCash, setSnackBar]}    
                />
            </Container>
            <Container sx={{ mt: 2, mb: 4 }}>
                <TotalAmount cash={cash}/>
            </Container>
        </Box>
    )
}