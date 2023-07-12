import { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'


// getting data from API
const stonksUrl = 'https://query1.finance.yahoo.com/v8/finance/chart/GME'

// this function calls the API and returns the data
async function getStocks() {

  const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(stonksUrl)}`);
  return response.json();
}

const chart = {
  
  options: {

    chart: {
      type: 'candlestick',
      height: 350
    },
    title: {
      text: 'CandleStick Chart',
      align: 'left'
    },
    xaxis: {
      type: 'datetime'
    },
    yaxis: {
      tooltip: {
        enabled: true
      }
    }
  }
};

function App() {

  const [series, setSeries] = useState([{
    data: []
  }]);
  const [price, setPrice] = useState(-1);
  const [prevPrice, setPrevPrice] = useState(-1);
  const [priceTime, setPriceTime] = useState(null);

  useEffect(() => {
    let timeoutId;
    async function getLatestPrice() {
      try {
        const data = await getStocks()
        const ans = data.contents;
        const gme = JSON.parse(ans).chart.result[0];
        setPrevPrice(price);
        setPrice(gme.meta.regularMarketPrice.toFixed(2));
        setPriceTime(new Date(gme.meta.regularMarketTime * 1000));
        const quote = gme.indicator.quote[0]  
        const prices = gme.timestamp.map((timestamp) => ({
          x: new Date(timestamp * 1000),
          y: [quote.open[index],quote.high[index],quote.low[index],quote.close[index]]
        }))
        setSeries([{
          data: prices,
        }])
      } catch (error) {
        console.log(error)
      }
      timeoutId = setTimeout(getLatestPrice, 10000);
    }
    getLatestPrice();
    // timeoutId = setTimeout(getLatestPrice, 5000);

    const cancelTimeout = () => {
      clearTimeout(timeoutId);
    };
  }, []);
  return (
    <div>
      <div className="ticker">
        GME
      </div>
      <div className={['price', prevPrice < price ? 'up' : prevPrice > price ? 'down' : ''].join(' ')}>
        $  {price}
      </div>
      <div className="price-time">
        {priceTime && priceTime.toLocaleTimeString()}
      </div>
      <Chart options={chart.options} series={series} type="candlestick" width="80%" height={320} />
    </div>
  );
}

export default App;
