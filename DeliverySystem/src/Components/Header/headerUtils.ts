import { AuthContextType } from "Components/AuthForm/AuthProvider";
import {
  USER_DASHBOARD_ROUTE,
  DRIVER_DASHBOARD_ROUTE,
  ADMIN_DASHBOARD_ROUTE,
} from "../../constants";
import {
  ROLE_ADMIN,
  ROLE_USER,
  ROLE_DRIVER,
} from "../../Hooks/useAuthentication";

const reRouteMap = new Map([
  [ROLE_USER, USER_DASHBOARD_ROUTE],
  [ROLE_ADMIN, ADMIN_DASHBOARD_ROUTE],
  [ROLE_DRIVER, DRIVER_DASHBOARD_ROUTE],
]);

export const handleClickPage = (
  navigate: (url: string, options?: { replace?: boolean; state?: any }) => void,
  url: string,
  setState: (value: boolean) => void,
  bool: boolean
) => {
  setState(bool);
  navigate(url);
};

export const handleDashboardReroute = (
    navigate: (url: string, options?: { replace?: boolean; state?: any }) => void,
    authContext: AuthContextType
) => {
  if (authContext.userInfo?.userTypeId === undefined) {
    throw new Error("UserTypeId is undefined");
  }
  navigate(
      `${reRouteMap.get(authContext.userInfo?.userTypeId)}${authContext.userInfo?.id}`
  );
};
