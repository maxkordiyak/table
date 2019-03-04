import {API, NotificationsAction} from "frontend-common";

export const fetchBranches = ({params}) => async dispatch => {
  const branches = await API.default
    .getBranches(params)
    .catch(error => dispatch(NotificationsAction.errorNotification(error)));

  return branches;
};
