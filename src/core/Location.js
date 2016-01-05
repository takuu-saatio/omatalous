import { canUseDOM } from "fbjs/lib/ExecutionEnvironment";
import createHistory from "history/lib/createBrowserHistory";
import createMemoryHistory from "history/lib/createMemoryHistory";
import useQueries from "history/lib/useQueries";

const location = useQueries(canUseDOM ? createHistory : createMemoryHistory)();
location.go = (path, state) => {

  location.push({
      pathname: path,
      state: state || null
  });

};

export default location;
