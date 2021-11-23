import React, { useState, useEffect } from "react";
import { Route } from "react-router-dom";
import Homepage from "./Homepage";
import CryptoPage from './CryptoPage';
import InflationPage from './InflationPage';

function Main(props) {
  const [mainData, setMainData] = useState({inputPrice: '', date: '30-03-2017', coin: 'bitcoin'})
  const [coinPriceCurrent, setCoinPriceCurrent] = useState('');
  const [coinPricePast, setCoinPricePast] = useState('');
  const [results, setResults] = useState({priceNow: '', percentChange: ''});
  const [inflation, setInflation] = useState({data: '', percentage: '', amountNow: ''})

  const currentApiCall = () => {
    fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd`
    )
      .then((res) => res.json())
      .then((data) => setCoinPriceCurrent(data.bitcoin.usd))
  };

  const oldApiCall = () => {
    fetch(
      `https://api.coingecko.com/api/v3/coins/bitcoin/history?date=30-03-2017&localization=false`
    )
      .then((res) => res.json())
      .then((data) => setCoinPricePast(data.market_data.current_price.usd))
  };

  const inflationApiCall = () => {
    fetch("https://data.nasdaq.com/api/v3/datasets/RATEINF/CPI_USA.json?api_key=dDi1qzdRACZxKWbNGJRx")
      .then((res) => res.json())
      .then((data) => setInflation({...inflation, data: data.dataset.data}))
  };

  const cryptoCalculator= () => {
    const currentPrice = ((mainData.inputPrice * coinPriceCurrent)/coinPricePast).toFixed(2);
    const percentChange = ((currentPrice/ mainData.inputPrice) * 100).toFixed(0);
    const priceLocale = Number(currentPrice).toLocaleString();
    const percentLocale = Number(percentChange).toLocaleString();
    setResults({ priceNow: priceLocale, percentChange: percentLocale });
  };

  const inflationCalculator = () => {
    const indexValue = (12 * (2021 - Number(mainData.date.slice(6, 10)))) + (9 - Number(mainData.date.slice(3, 5)))
    const percentage = inflation.data && (((274.31 - Number(inflation.data[indexValue][1]))/Number(inflation.data[indexValue][1])) * 100).toFixed(2)
    const amountNow = (percentage / 100) + 1
    setInflation({...inflation, percentage: percentage, amountNow: amountNow})
  }

  useEffect(() => {
    inflationApiCall()
    currentApiCall()
    oldApiCall()
  }, [])

  useEffect(() => {
    cryptoCalculator()
    inflationCalculator()
  }, [mainData.inputPrice])

  return (
    <div className={props.routePageClass}>
        <Route
          exact
          path="/"
          render={() => <Homepage results={results} mainData={mainData} setMainData={setMainData} inflation={inflation}/>}
        />
        <Route
          exact
          path="/Crypto-Details"
          render={() => <CryptoPage />}
        />
        <Route
          exact
          path="/Inflation-Calculator"
          render={() => <InflationPage/>}
        />
    </div>
  );
}

export default Main;
