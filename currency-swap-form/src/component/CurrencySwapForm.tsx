import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TextField, MenuItem, Button, Typography, Container, Grid, InputAdornment, CircularProgress } from '@mui/material';

interface Token {
  symbol: string;
  name: string;
  icon: string;
}

interface PriceData {
  [symbol: string]: number;
}

const CurrencySwapForm: React.FC = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [prices, setPrices] = useState<PriceData>({});
  const [fromToken, setFromToken] = useState<string>('');
  const [toToken, setToToken] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        // Start loading
        setLoading(true); 
        const iconsUrl = 'https://api.github.com/repos/Switcheo/token-icons/contents/tokens';
        const response = await axios.get(iconsUrl);
        const tokenIcons = response.data.map((file: any) => {
          const symbol = file.name.split('.')[0].toUpperCase();
          return {
            symbol,
            name: symbol,
            icon: file.download_url
          };
        });
        setTokens(tokenIcons);

        const priceResponse = await axios.get('https://interview.switcheo.com/prices.json');
        setPrices(priceResponse.data);
        // End loading
        setLoading(false); 
      } catch (err) {
        console.error('Error fetching token data:', err);
        setLoading(false); 
      }
    };

    fetchTokenData();
  }, []);

  const convertPrice = (
    prices: PriceData,
    fromToken: string,
    toToken: string,
    amount: number
  ): number | null => {
    const fromTokenPrice = prices[fromToken];
    const toTokenPrice = prices[toToken];

    if (!fromTokenPrice || !toTokenPrice) {
      return null;
    }

    return (amount * fromTokenPrice) / toTokenPrice;
  };

  const handleSwap = () => {
    if (!fromToken || !toToken || amount <= 0) {
      setError('Vui lòng điền vào tất cả các trường có giá trị hợp lệ.');
      return;
    }

    const resultAmount = convertPrice(prices, fromToken, toToken, amount);

    if (resultAmount === null) {
      setError('Không có giá hợp lệ.');
      return;
    }

    setResult(resultAmount);
    setError('');
  };

  if (loading) {
    return (
      <Container>
        <Typography variant="h4" gutterBottom>
          Currency Swap
        </Typography>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Currency Swap
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            select
            label="From"
            value={fromToken}
            onChange={(e) => setFromToken(e.target.value)}
            fullWidth
          >
            {tokens.map((token) => (
              <MenuItem key={token.symbol} value={token.symbol}>
                <img src={token.icon} alt={token.name} style={{ width: 20, marginRight: 10 }} />
                {token.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            select
            label="To"
            value={toToken}
            onChange={(e) => setToToken(e.target.value)}
            fullWidth
          >
            {tokens.map((token) => (
              <MenuItem key={token.symbol} value={token.symbol}>
                <img src={token.icon} alt={token.name} style={{ width: 20, marginRight: 10 }} />
                {token.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            fullWidth
            InputProps={{
              startAdornment: <InputAdornment position="start">{fromToken}</InputAdornment>,
            }}
          />
        </Grid>
        {error && (
          <Grid item xs={12}>
            <Typography color="error">{error}</Typography>
          </Grid>
        )}
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSwap}>
            Swap
          </Button>
        </Grid>
        {result !== null && (
          <Grid item xs={12}>
            <Typography variant="h6">
              {amount} {fromToken} = {result.toFixed(2)} {toToken}
            </Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default CurrencySwapForm;
