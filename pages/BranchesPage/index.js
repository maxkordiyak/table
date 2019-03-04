import {connect} from "react-redux";
import {fetchBranches} from "../../actions/branches";
import {BranchesPage} from "./BranchesPage.web";
import {NavigationAction} from "frontend-common";
const mapStateToProps = state => ({
  translations: state.locale.translations.branches,
  isAdmin: state.auth.userType === "admin",
  globaltheme: state.globaltheme,
});
const mapDispatchToProps = dispatch => ({
  fetchBranches: params => dispatch(fetchBranches(params)),
  go: nextLocation => dispatch(NavigationAction.go(nextLocation)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BranchesPage);
