import { Button } from "@mui/material";
import { User } from "../models";
import { useCallback } from "react";
import { AuthService, OrderService, UserService } from "../services";

export const Test = () => {
  const onClick = useCallback(async () => {
    await OrderService.GetOrdersBySenderId(2);
  }, []);
  return (
    <>
      <Button variant="text" onClick={onClick}>
        Text
      </Button>
    </>
  );
};
