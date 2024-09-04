import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

// Initialize recoil-persist
const { persistAtom } = recoilPersist();

export const userItem = atom({
  key: 'userItem', // unique ID (with respect to other atoms/selectors)
  default: {
    name: 'rice',
    price: 30,
    total: 3000,
    unit: 'kg',
  }, // default value (aka initial value)
  effects_UNSTABLE: [persistAtom], // Add persist effect
});
