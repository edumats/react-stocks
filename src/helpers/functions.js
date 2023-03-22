// Calculates total stock value
export function calculateStockValue(symbol, quantity) {
    { }
}

// Checks if current stock data is in local storage, if not, calls API to retrieve
export function fetchStockData(symbol) {
    let response;
    // If not found in sessionStorage, fetches from API
    if (sessionStorage.getItem(symbol) === null) {
        response = getStock([symbol]);
        console.log(`Fetching from API: ${response}`)
        sessionStorage.setItem(symbol, JSON.stringify(response))
    } else {
        // Fetches stock data from sessionStorage
        response = JSON.parse(sessionStorage.getItem(symbol))
        console.log(`Get from LS: ${JSON.stringify(response)}`)
    }
    console.log(`Fetching: ${response}`)
    return response
}

// Makes API call to retrieve that from a symbol, returns a array with the results
export async function getStock(symbol) {
    const response = await fetch(`https://brapi.dev/api/quote/${symbol.join(',')}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Error contacting the API')
        }
        return response
    })
    .catch(error => {
        console.error(error)
    })

    const data = await response.json()
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
    const symbolValidator = /^[A-Z]+[1-9]{1,2}[A-Z]?$/;
    return symbolValidator.test(symbol)
}

// Converts monetary values to integers
export function cashToInteger(monetary_value) {
    if (typeof monetary_value === 'string') {
        throw new Error('Error: Monetary value passed as string!')
    }
    return monetary_value * 100
}
