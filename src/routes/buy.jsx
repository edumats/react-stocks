import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button';
import Box from '@mui/material/Box'
import { getStock, validateNumberInput, validateSymbol, cashToInteger, fetchStockData } from '../helpers/functions'
import { Typography } from '@mui/material';

export default function TransactionForm(props) {
  const [stocks, setStocks, cash, setCash] = useOutletContext();
  const [symbol, setSymbol] = useState('')
  const [quantity, setQuantity] = useState(0)
  const [isButtonDisabled, setButtonDisabled] = useState(true)
  const [preview, setPreview] = useState('')
  const [isPreviewVisible, setPreviewVisible] = useState(false)
  const [isDataValid, setDataValid] = useState(false)

  useEffect(() => {
    setButtonDisabled(!isDataValid);
    setPreviewVisible(isDataValid);
  }, [isDataValid])

  useEffect(() => {
    // If both fields have valid values, activate button. Otherwise, disable button
    if (validateSymbol(symbol) && validateNumberInput(quantity)) {
      setDataValid(true)
      console.log(`Button active. Symbol: ${symbol} quantity: ${quantity}`)
      setPreview(fetchStockData(symbol)['regularMarketPrice'] * 100 * quantity)
      return;
    }
    console.log(`Button disabled. Symbol: ${symbol} quantity: ${quantity}`)
    setDataValid(false)
  }, [symbol, quantity])

  // If not numbers, ignore when saving to state
  function handleQuantityChange(event) {
    const inputValue = event.target.value.replace(/[^0-9]/g, "");
    setQuantity(Number(inputValue))
  }

  // Function for selling stocks
  async function removeFromStocks() {
    // Checks if quantity is an integer
    if (!Number.isInteger(quantity)) {
      throw new Error('Quantity is not an integer!')
    }
    // Get updated stock data
    let [updatedStock] = await getStock([symbol]);
    const {
      symbol: returned_symbol,
      regularMarketPrice,
      regularMarketTime
    } = updatedStock;

    /* Checks if symbol already exists in state, returns index number if found, otherwise -1 */
    const index = stocks.findIndex(stock => stock.symbol === returned_symbol)

    // Throws error if stock being sold is not found in stocks
    if (index === -1) {
      throw new Error('Symbol was not found in your stocks')
    }
    // Update stock's history with a sell event
    setStocks(stocks.map(stock => {
      if (stock.symbol === returned_symbol) {
        const newHistory = [...stock.history, {
          buy: false,
          quantity: quantity,
          regularMarketPrice: cashToInteger(regularMarketPrice),
          regularMarketTime: regularMarketTime,
        }]
        return { ...stock, history: newHistory }
      } else {
        return stock
      }
    }))
    // Update cash with the total sold out
    setCash(cash + (cashToInteger(regularMarketPrice) * quantity))

  }

  // Function for buying stocks
  async function addToStocks() {
    // Checks if quantity is an integer
    if (!Number.isInteger(quantity)) {
      throw new Error('Quantity is not an integer!')
    }
    // Get updated stock data
    let [updatedStock] = await getStock([symbol]);
    const {
      symbol: returned_symbol,
      shortName,
      regularMarketPrice,
      regularMarketTime
    } = updatedStock;

    /* Checks if symbol already exists in state, returns index number if found, otherwise -1 */
    const index = stocks.findIndex(stock => stock.symbol === returned_symbol)

    /* If symbol was not found, create object and add to state */
    if (index === -1) {
      setStocks([...stocks, {
        symbol: returned_symbol,
        shortName: shortName,
        history: [{
          buy: true,
          quantity: quantity,
          regularMarketPrice: cashToInteger(regularMarketPrice),
          regularMarketTime: regularMarketTime,
        }]
      }])
    } else {
      // If symbol already exists, update its history
      setStocks(stocks.map(stock => {
        // If target stock is found, update it
        if (stock.symbol === returned_symbol) {
          const newHistory = [...stock.history, {
            buy: true,
            quantity: quantity,
            regularMarketPrice: cashToInteger(regularMarketPrice),
            regularMarketTime: regularMarketTime,
          }]
          return { ...stock, history: newHistory }
        }
        // If not target stock, do nothing
        return stock
      }))
    }
    setCash(cash - (cashToInteger(regularMarketPrice) * quantity))
  }

  return (
    <Box component="form" sx={{display: "flex", flexDirection: "column", width: "80%", margin: "auto"}}>
      <TextField 
        label="Ação"
        helperText="Insira o nome da ação"
        type="text"
        margin="normal"
        value={symbol}
        onChange={e => setSymbol(e.target.value.toUpperCase())}
      />
      <TextField
        label="Quantidade"
        helperText="Somente números. Por exemplo, 3"
        type="number"
        margin="normal"
        value={quantity}
        onChange={handleQuantityChange}
      />
      {isPreviewVisible ? (
        <Typography my={1} variant="subtitle2" component="p">
          Total da {props.mode === "buy" ? "compra" : "venda"}: R$ {(preview / 100).toFixed(2)}
        </Typography>
      ) : null}
      
      <Button variant="contained" onClick={props.mode === "buy" ? addToStocks : removeFromStocks} disabled={isButtonDisabled}>
        {props.mode === "buy" ? "Comprar" : "Vender"}
      </Button>
    </Box>
  );
}