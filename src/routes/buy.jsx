import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import FormControl from '@mui/material/FormControl'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button';
import Box from '@mui/material/Box'
import { getStock, validateNumberInput, validateSymbol, cashToInteger } from '../helpers/functions'

export default function TransactionForm(props) {
  const [stocks, setStocks, cash, setCash] = useOutletContext();
  const [symbol, setSymbol] = useState('')
  const [quantity, setQuantity] = useState(0)
  const [isDisabled, setIsDisabled] = useState(true)
  const [preview, setPreview] = useState('')

  useEffect(() => {
    // If both fields have valid values, activate button. Otherwise, disable button
    if (validateSymbol(symbol) && validateNumberInput(quantity)) {
      setIsDisabled(false);
      setPreview()
      return;
    }
    setIsDisabled(true)
  }, [symbol, quantity])

  // Saves symbol to state in uppercase
  function handleSymbolChange(event) {
    const { value } = event.target;
    setSymbol(value.toUpperCase());
  }

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
    <FormControl sx={{ width: '100%'}}>
      <FormGroup>
        <FormLabel>Ação</FormLabel>
        <FormControl type="text" value={symbol} onChange={e => {handleSymbolChange(e);}}/>
        <TextField>
          Por exemplo, PETR3
        </TextField>
      </FormGroup>

      <FormGroup>
        <FormLabel>Quantidade</FormLabel>
        <FormControl type="text" pattern="[0-9]"  value={quantity} onChange={e => {handleQuantityChange(e);}}/>
        <TextField>
          Somente números inteiros, a partir de 1
        </TextField>
      </FormGroup>
      <Box>{preview}</Box>
      <Button variant="contained" onClick={props.mode === "buy" ? addToStocks : removeFromStocks} disabled={isDisabled}>
        {props.mode === "buy" ? "Comprar" : "Vender"}
      </Button>
    </FormControl>
  );
}