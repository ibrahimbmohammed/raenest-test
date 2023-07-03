import { useEffect, useState } from "react";
import "./App.css";

type ExchangeRates = {
  [currencyCode: string]: number;
};
function App() {
  const currencyOptions = [
    { currency: "USD", balance: 5000 },
    { currency: "GBP", balance: 2000 },
    { currency: "EUR", balance: 3500 },
    { currency: "NGN", balance: 200000 },
  ];
  const [data, setData] = useState<ExchangeRates>({});
  const [currencyInput, setCurrencyInput] = useState(0);
  const [secondCurrencyInput, setSecondCurrencyInput] = useState<number>();
  const [currencyOps, setCurrencyOps] = useState(currencyOptions);
  const [currencyOps2, setCurrencyOps2] = useState<typeof currencyOptions>(
    currencyOptions?.slice(1)
  );
  const initData = currencyOptions[0].currency;
  const [error, setError] = useState<null | unknown>(null);
  const [selectedcurrencyOps, setSelectedcurrencyOps] = useState<string>(
    currencyOps2[0].currency
  );

  const fetchData = async (params: any) => {
    try {
      const res = await fetch(
        `https://api.exchangerate-api.com/v4/latest/${params}`
      );
      const data = await res.json();
      setData(data?.rates);
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    fetchData(initData);
  }, []);

  useEffect(() => {
    if (selectedcurrencyOps === "" || selectedcurrencyOps == null) return;

    const rate = data[selectedcurrencyOps];
    const convValue = Number(rate) * Number(currencyInput);
    if (convValue) {
      setSecondCurrencyInput(convValue);
    }
  }, [currencyInput, data, selectedcurrencyOps]);

  const handleCurrencyInput = (e) => {
    setCurrencyInput(e);
  };

  const handleCurrencySelect = (e) => {
    fetchData(e);
    setCurrencyOps2(currencyOps.filter((item) => item.currency != e));
    const value = currencyOps.filter((item) => item.currency != e)[0];
    handleCurrencySelect2(value?.currency);
    handleCurrencyInput(0);
    setSecondCurrencyInput(0);
  };
  const handleCurrencySelect2 = (e) => {
    setSelectedcurrencyOps(e);
    handleCurrencyInput(0);
    setSecondCurrencyInput(0);
  };
  return (
    <section className="container">
      <main className="main-box">
        <div className="">convert from one to another currency</div>
        <div className="drop">
          <select
            className="select-style"
            onChange={(e) => handleCurrencySelect(e.target.value)}
          >
            {currencyOps?.map((item) => (
              <option value={item?.currency}> {item?.currency}</option>
            ))}
          </select>
        </div>
        <div className="">
          <input
            type="number"
            name="currencyInput"
            value={currencyInput}
            onChange={(e) => handleCurrencyInput(e.target.value)}
          />
        </div>
        <div className="">
          <select onChange={(e) => handleCurrencySelect2(e.target.value)}>
            {currencyOps2?.map((item) => (
              <option value={item?.currency}> {item?.currency}</option>
            ))}
          </select>
        </div>
        <div className="">
          <input
            type="number"
            value={secondCurrencyInput}
            onChange={(e) => setSecondCurrencyInput(Number(e.target.value))}
          />
        </div>
      </main>
      <aside className="aside-box">
        <div className="aside-box-item">
          <span className="">
            <p className="">Youre converting :</p>
          </span>
          <span className="">
            <p className="">You'll get :</p>
          </span>
          <span className="">
            <p className="">Source :</p>
          </span>
        </div>
      </aside>
    </section>
  );
}

export default App;
