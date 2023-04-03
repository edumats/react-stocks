// Format integer to Brazilian currency and return as string
export function integerToReais(integer) {
    const toDecimal = integer / 100
    return toDecimal.toLocaleString(
        'pt-BR',
        {style: 'currency', currency: 'BRL'}
    ).toString()
}

// Takes a date string and compare with current datetime, check if less than the elapsed time in minutes
// Default minutes = 15
export function isDataStale(date1, minutes = 15) {
    const providedDate = new Date(date1)
    const currentDate = new Date()
    const difference = currentDate - providedDate
    const convertToMinutes = difference => difference / 1000 * 60
    if (convertToMinutes(difference) > minutes) {
        return true
    }
    return false
}

// If stock data is not in local storage or is it stale, calls API to retrieve data
// Otherwise, get data from localStorage
export async function fetchStockData(symbol) {
    let stockData;
    const foundInLocalStorage = localStorage.getItem(symbol)
    // If not found in localStorage, fetches from API
    if (foundInLocalStorage === null || isDataStale(foundInLocalStorage['regularMarketTime'], 1)) {
        try {
            [ stockData ] = await getStock([symbol])
        } catch (error) {
            throw new Error('Error fetching from API')
        }
        
        console.log(`Fetching from API: ${stockData['regularMarketPrice']}`)
        localStorage.setItem(symbol, JSON.stringify(stockData))
        return stockData
    } else {
        // Fetches stock data from localStorage
        stockData = JSON.parse(localStorage.getItem(symbol))
        console.log(`Get from LS: ${JSON.stringify(stockData)}`)
        return stockData
    }
}

// Makes API call to retrieve that from a symbol, returns a array with the results
export async function getStock(symbol) {
    const response = await fetch(`https://brapi.dev/api/quote/${symbol.join(',')}`)
    
    if (!response.ok) {
        throw new Error('Error contacting API')
    }

    const data = await response.json()
    // Returns an array with one of more objects, each object corresponds to a stock data
    return data['results']
}

// Receives the history of transactions of a stock and return its current total quantity
export function getTotalQuantity(history) {
    return history.reduce((acc, transaction) => {
        if (transaction.buy) {
            return acc + Number(transaction.quantity);
        } else {
            return acc - Number(transaction.quantity);
        }
    }, 0)
}

// If it a positive integer or float, returns true, otherwise, false
export function validateNumberInput(value) {
    const numberRegex = /^(?=.*[1-9])\d*(?:\.\d+)?$/;
    return numberRegex.test(value);
}

// Returns true if valid Brazilian symbol, otherwise, false
export function validateSymbol(symbol) {
    const symbolValidator = /^[A-Z]{4}[1-9]{1,2}[A-Z]?$/;
    return symbolValidator.test(symbol)
}

// Converts monetary values to integers
export function cashToInteger(monetary_value) {
    if (typeof monetary_value === 'string') {
        throw new Error('Error: Monetary value passed as string!')
    }
    return monetary_value * 100
}
