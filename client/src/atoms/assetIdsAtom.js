import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';
const { persistAtom } = recoilPersist();

const assetIdsAtom = atom({
  key: 'assetIdsAtom', // Unique ID for this atom
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export default assetIdsAtom;
