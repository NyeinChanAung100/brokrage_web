import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

// Initialize recoil-persist
const { persistAtom } = recoilPersist();

export const buyorsellAtom = atom({
  key: 'buyorsellAtom', // unique ID (with respect to other atoms/selectors)
  default: {
    trade: 'buy',
  }, // default value (aka initial value)
  effects_UNSTABLE: [persistAtom], // Add persist effect
});
