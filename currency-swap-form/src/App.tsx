import React from 'react';
import { CssBaseline } from '@mui/material';
import CurrencySwapForm from './component/CurrencySwapForm';

const App: React.FC = () => {
  return (
    <div>
      <CssBaseline />
      <CurrencySwapForm/>
    </div>
  );
};

export default App;
