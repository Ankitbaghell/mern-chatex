import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";

function Homepage() {
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) history.push("/chats");
  }, [history]);

  return (
    <Container maxW="xl" centerContent marginTop="40px">
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        backgroundColor="#1d1d1d"
        color="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
      >
        <Text fontSize="4xl" fontFamily="'Satisfy', cursive;">
          👋 Chatex
        </Text>
      </Box>
      <Box bg="#1d1d1d" w="100%" p={4} borderRadius="lg">
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab _selected={{ color: "#0077ff" }} _focus={{}} _active={{}}>
              Login
            </Tab>
            <Tab _selected={{ color: "#0077ff" }} _focus={{}} _active={{}}>
              Sign Up
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default Homepage;
