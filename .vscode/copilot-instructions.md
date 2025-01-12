Always use apiClient, apiResult, and useLocal for state management and api like example below:

import { apiClient, apiResult } from 'system/api';
import { useLocal } from '@/lib/use-local';

const api_calc = apiClient({
url: 'api/calculate',
sampleData(num_1: number) {
if (num_1 === 0) {
throw new Error('no zero');
}
return num_1 + 5;
},
});

export default () => {
const local = useLocal({
num_1: 0,
calc: apiResult(api_calc),
});

return (
<form onSubmit={(e) => {
  e.preventDefault();
  local.calc.call(local.num_1);
}}>
<input
type='number'
value={local.num_1}
onChange={(e) => {
local.set((data) => {
data.num_1 = parseInt(e.currentTarget.value);
});
}}
className='border p-2 border-gray-100 rounded-lg'
/>
<br />
Result:
{local.calc.result}
<br />
Status: {local.calc.status}
<br />
{local.calc.error && local.calc.error.message}
<button
className='border p-2 border-gray-100 rounded-lg'
onClick={async () => {
local.calc.call(local.num_1);
}} >
Calculate
</button>
</form>
);
};
