export default function formatCurrency(value: number|string){
    if (typeof value === 'string') value = parseFloat(value);
    return value.toLocaleString('en-US', {style: 'currency', currency: 'LKR'});
}
