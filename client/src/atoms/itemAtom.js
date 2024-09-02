import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

// Initialize recoil-persist
const { persistAtom } = recoilPersist();

export const itemAtom = atom({
  key: 'itemAtom', // unique ID (with respect to other atoms/selectors)
  default: {
    name: 'rice',
    price: 30,
    unitprice: 10,
    unit: 'kg',
  }, // default value (aka initial value)
  effects_UNSTABLE: [persistAtom], // Add persist effect
});
