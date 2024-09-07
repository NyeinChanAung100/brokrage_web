import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

// Initialize recoil-persist
const { persistAtom } = recoilPersist();

export const allItemAtom = atom({
  key: 'allItemAtom', // unique ID (with respect to other atoms/selectors)
  default: {
    name: 'gold',
    price: 80.54,
    unit: 'g',
    quantity: 1,
  }, // default value (aka initial value)
  effects_UNSTABLE: [persistAtom], // Add persist effect
});
