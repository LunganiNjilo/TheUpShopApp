import { FunctionComponent } from 'react';
import classes from './currency-formatter.module.scss';

interface Props {
  amount?: number;
}

export const CurrencyFormatter: FunctionComponent<Props> = ({ amount = 0 }) => {
  const formattedAmount = amount.toLocaleString('en-ZA', {
    style: 'currency',
    currency: 'ZAR'
  });

  return <span className={classes.currency}>{formattedAmount}</span>;
};
