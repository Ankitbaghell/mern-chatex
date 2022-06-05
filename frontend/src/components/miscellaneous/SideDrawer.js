import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";

import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import { Tooltip } from "@chakra-ui/tooltip";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import ChatLoading from "../ChatLoading";
import { Spinner } from "@chakra-ui/spinner";
import ProfileModal from "./ProfileModal";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import { getSender } from "../../config/ChatLogics";
import UserListItem from "../userAvatar/UserListItem";
import { ChatState } from "../../Context/ChatProvider";

function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const history = useHistory();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const handleSearch = async () => {
    //searching box
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  //click on searched user and start chatting
  const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]); //if chats already with us then it will just update the chats
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Box
        bg="#1d1d1d"
        color="white"
        d="flex"
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="8px"
        borderColor="#1d1d1d"
      >
        <Tooltip label="search users to chat" hasArrow placement="bottom-end">
          <Button
            bg="#323232"
            variant="ghost"
            onClick={onOpen}
            _hover={{}}
            _focus={{}}
            _active={{}}
          >
            <i className="fas fa-search"></i>
            <Text fontWeight="light" d={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="'Satisfy', cursive;">
          👋 Chatex
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList
              bg="#323232"
              border="none"
              pl={2}
              pr={2}
              _focus={{}}
              _active={{}}
            >
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  // bg="#1d1d1d"
                  mb="1px"
                  _hover={{
                    backgroundColor: "#014a9c",
                  }}
                  _focus={{}}
                  _active={{}}
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              as={Button}
              bg="transparent"
              _hover={{}}
              _focus={{}}
              _active={{}}
              rightIcon={<ChevronDownIcon />}
            >
              <Avatar
                border="4px solid #0077ff"
                size="md"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList bg="#323232" border="none">
              <ProfileModal user={user}>
                <MenuItem
                  transition="all 0.3s ease-in-out"
                  _hover={{ letterSpacing: "1px" }}
                  _focus={{}}
                  _active={{}}
                >
                  My Profile 👨‍🏫
                </MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem
                onClick={logoutHandler}
                transition="all 0.3s ease-in-out"
                _hover={{ letterSpacing: "1px" }}
                _focus={{}}
                _active={{}}
              >
                Logout 📤
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent bg="#1d1d1d">
          <DrawerHeader color="white" borderBottomWidth="1px">
            Search Users 😉
          </DrawerHeader>
          <DrawerBody>
            <Box d="flex" pb={2}>
              <Input
                border="none"
                borderRadius="10px"
                color="white"
                padding="10px 20px"
                variant="flushed"
                bg="#323232"
                placeholder="Search by name or email"
                mr={3}
                mb={4}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button
                backgroundColor="#0077ff"
                color="white"
                fontWeight="bold"
                _hover={{
                  backgroundColor: "#014a9c",
                }}
                borderRadius="10px"
                _focus={{}}
                _active={{}}
                onClick={handleSearch}
              >
                Go
              </Button>
            </Box>
            {loading ? (
              <ChatLoading /> //loading animation
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner color="white" ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;
