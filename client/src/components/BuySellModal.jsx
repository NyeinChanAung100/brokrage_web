import React, { useState } from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { tradeItem } from '../services/marketService.js';
import useShowToast from '../hooks/useShowToast';
import { allItemAtom } from '../atoms/allItemAtom.js';
import { viewItemPrice, viewItems } from '../services/userService.js';
import { buyorsellAtom } from '../atoms/buyorsellAtom.js';
function InitialFocus({
  isOpen,
  onClose,
  total,
  quantity,
  itemId,
  name,
  userId,
  fetchData,
  refreshPage,
}) {
  const [allItem, setAllItem] = useRecoilState(allItemAtom);
  const trade = useRecoilValue(buyorsellAtom);
  const showToast = useShowToast();
  // const user = useRecoilValue(userAtom);
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const uid = parseInt(userId, 10); // Output: 123
  const iid = parseInt(itemId, 10); // Output: 123

  // console.log('ququ:', quantity + 1);
  const head = `${trade} ${quantity} ${name} for $${total}`;
  const tradeData = {
    user_id: uid,
    item_id: iid,
    trade_type: trade,
    quantity: quantity,
  };
  // const itemIId = {
  //   item_id: iid,
  // };
  console.log('trade data', tradeData);
  const handleTrade = async () => {
    try {
      // console.log('itemId in model', itemId);
      const data = await tradeItem(tradeData);
      // const itemPrice = await viewItems(iid);
      // console.log(first);
      fetchData();
      if (data.error) {
        throw new Error(data.error || `Fail to ${trade} ${name}`);
      }
      // console.log(tradeData.user_id);
      // console.log(data.message);
      showToast(data.message);
      // setAllItem((prevItem) => ({
      //   ...prevItem,
      //   price: itemPrice.price,
      // }));
    } catch (error) {
      console.error(`Error in trademodal:`, error.message);
      showToast('Error', error.message, 'error');
    }
    // onRefresh(!refresh);
    // refreshPage();
    onClose();
  };
  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{head}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {`Are you sure you want to ${trade} ${name} for ${total}`}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={handleTrade}>
            Comfirm
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default InitialFocus;
