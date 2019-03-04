import {fetchBranches} from "./branches";
import {API} from "frontend-common";
import {errorNotification} from "frontend-common/src/actions/notifications";
jest.mock("frontend-common/src/utils/api/branches");
jest.mock("frontend-common/src/actions/notifications");
describe("Branch action tests", () => {
  beforeEach(() => {
    API.default.getBranches.mockClear();
    errorNotification.mockClear();
  });
  it("calls fetch branches function", () => {
    invokeFetchBranches({params: {}});
    expect(API.default.getBranches).toHaveBeenCalled();
  });
  it("dispatches error notification on service failure", async () => {
    const error = new Error("Unable to contact API service");
    const err = {type: "FAKE_ERROR", message: error};
    API.default.getBranches.mockImplementation(async () => {
      throw error;
    });
    errorNotification.mockImplementation(() => {
      return err;
    });
    const dispatchFake = await invokeFetchBranches({params: {}});
    expect(errorNotification).toHaveBeenCalled();
    expect(dispatchFake).toHaveBeenCalledWith(err);
  });
  const invokeFetchBranches = params => {
    const dispatchFake = jest.fn();
    fetchBranches(params)(dispatchFake);

    return dispatchFake;
  };
});
