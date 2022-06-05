import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  Text,
  Image,
} from "@chakra-ui/react";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          backgroundColor="#0077ff"
          color="white"
          _hover={{
            backgroundColor: "#014a9c",
          }}
          d={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
        />
      )}
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent bg="#323232" h="410px" color="white">
          <ModalHeader fontSize="38px" d="flex" justifyContent="center">
            {user.name}
          </ModalHeader>
          {/* <ModalCloseButton /> */}
          <ModalBody
            d="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Image
              borderRadius="full"
              border="4px solid #0077ff"
              boxSize="160px"
              src={user.pic}
              alt={user.name}
            />
            <Text fontSize={{ base: "25px", md: "28px" }}>
              📧 email: {user.email}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              backgroundColor="#0077ff"
              color="white"
              fontWeight="bold"
              width="100%"
              _hover={{
                backgroundColor: "#014a9c",
              }}
              onClick={onClose}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
