import { useState, useEffect } from "react";
import { useQuery } from "react-query";

//styles
import { Wrapper } from "./styles/App.styles";
//Actions
import { changeCurrency } from "./features/appSlice";
//Hooks
import { useAppSelector, useAppDispatch } from "./reduxHooks";
import { useGetBitcoinDataQuery } from "./services/app";

type BitcoinData = {
  "15m": number;
  buy: number;
  last: number;
  sell: number;
  symbol: string;
};

type Currencies = {
  [key: string]: BitcoinData;
};

const getBitcoinData = async (): Promise<Currencies> =>
  await (await fetch("https://blockchain.info/ticker")).json();

const INTERVAL_TIME = 30000; //30s

const App = () => {
  const { currency } = useAppSelector((state) => state.app);
  const dispatch = useAppDispatch();

  const { data, isLoading, error, refetch } = useGetBitcoinDataQuery(
    undefined,
    {
      pollingInterval: INTERVAL_TIME,
    }
  );

  const handleCurrencySelection = (e: any) => {
    dispatch(changeCurrency(e.currentTarget.value));
  };

  useEffect(() => {
    const interval = setInterval(refetch, INTERVAL_TIME);
    return () => clearInterval(interval);
  }, [refetch]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Ups! Something went wrong...</div>;

  return (
    <Wrapper>
      <>
        <h2>Bitcoin Price</h2>
        <select value={currency} onChange={handleCurrencySelection}>
          {data &&
            Object.keys(data).map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
        </select>
        <div>
          <h2>
            {data && data[currency].symbol}
            {data && data[currency].last}
          </h2>
        </div>
      </>
    </Wrapper>
  );
};

export default App;
