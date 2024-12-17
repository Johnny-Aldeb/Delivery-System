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
import { USER_INFO, USER_ID, USER_TYPE_ID } from "../../Hooks/constants";

const reRouteMap = new Map([
  [ROLE_USER, USER_DASHBOARD_ROUTE],
  [ROLE_ADMIN, ADMIN_DASHBOARD_ROUTE],
  [ROLE_DRIVER, DRIVER_DASHBOARD_ROUTE],
]);

export const handleClickPage = (
  navigate: Function,
  url: string,
  setState: Function,
  bool: boolean
) => {
  setState(bool);
  navigate(url);
};

export const handleDashboardReroute = (
  navigate: Function,
  authContext: AuthContextType
) => {
  navigate(
    `${reRouteMap.get(authContext?.[USER_INFO]?.[USER_TYPE_ID])}${
      authContext?.[USER_INFO]?.[USER_ID]
    }`
  );
};
