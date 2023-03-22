function TotalAmount(props) {

    return (
        <div>
            <h1>Total Carteira</h1>
            <span>R$ {(props.cash / 100).toFixed(2)}</span>
        </div>
    )
}

export default TotalAmount;