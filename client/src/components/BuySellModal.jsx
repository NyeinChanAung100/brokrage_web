import React from 'react';
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

function InitialFocus({ isOpen, onClose, bors }) {
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Buy 300 bitcoins</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {/* <FormControl>
            <FormLabel>First name</FormLabel>
            <Input ref={initialRef} placeholder='First name' />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Last name</FormLabel>
            <Input placeholder='Last name' />
          </FormControl> */}
          {bors}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3}>
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default InitialFocus;
