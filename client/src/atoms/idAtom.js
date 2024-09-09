import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';
const { persistAtom } = recoilPersist();

const idAtom = atom({
  key: 'idAtom', // Unique ID for this atom
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export default idAtom;
