import { PriceData } from "./types";

export const fetchPriceData = async (): Promise<PriceData> => {
    const response = await fetch('https://interview.switcheo.com/prices.json');
    if (!response.ok) {
        throw new Error('Failed to fetch price data');
    }

    const data: PriceData = await response.json();
    return data;
};


export const convertPrice = (
    data: PriceData,
    fromCurrency: string,
    toCurrency: string,
    amount: number
) : number => {
    const fromRate = data[fromCurrency]?.USD;
    const toRate = data[toCurrency]?.USD;

    if (fromRate === undefined || toRate === undefined) {
        throw new Error('Invalid currency code');
    }

    const convertedAmount = amount * (toRate / fromRate);
    return convertedAmount;
}