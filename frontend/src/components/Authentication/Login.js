import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";

const Login = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const { setUser } = ChatState();

  const history = useHistory();

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    // console.log(email, password);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      // console.log(JSON.stringify(data));
      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      // setLoading(false);
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      setUser(userInfo);
      history.push("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing="10px">
      <FormControl id="email" isRequired border="transparent" color="white">
        <FormLabel color="white">Email Address</FormLabel>
        <Input
          border="none"
          borderRadius="10px"
          color="white"
          padding="10px 20px"
          variant="flushed"
          value={email}
          bg="#323232"
          type="email"
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired border="none" color="white">
        <FormLabel color="white">Password</FormLabel>
        <InputGroup size="md">
          <Input
            border="none"
            borderRadius="10px"
            padding="10px 20px"
            bg="#323232"
            variant="flushed"
            color="white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={show ? "text" : "password"}
            placeholder="Enter password"
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              background="transparent"
              onClick={handleClick}
              _hover={{
                background: "none",
              }}
              _focus={{}}
              _active={{}}
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        backgroundColor="#0077ff"
        color="white"
        fontWeight="bold"
        width="100%"
        _hover={{
          backgroundColor: "#014a9c",
        }}
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login ➔
      </Button>
      <Button
        background="transparent"
        color="#0077ff"
        width="50%"
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("123456");
        }}
        _hover={{ color: "#014a9c" }}
        _focus={{}}
        _active={{}}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
