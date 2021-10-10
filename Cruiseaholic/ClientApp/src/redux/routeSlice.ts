import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { Route } from "../../types";
import { toast } from "../App";
import { RootState } from "./store";

interface RouteState {
  routes: null | Route[];
  routesLoading: boolean;
}

const initialState: RouteState = {
  routes: null,
  routesLoading: false,
};

const namespace = "route";

export const getRoutes = createAsyncThunk(
  `${namespace}/getRoutes`,
  async () => {
    try {
      const res = await fetch("order/getRoutes");
      return await res.json();
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong getting available routes");
    }
  }
);

interface AddRouteParam {
  route: Omit<Route, "id">;
  history: any;
}

export const addRoute = createAsyncThunk(
  `${namespace}/addRoute`,
  async ({ route, history }: AddRouteParam) => {
    try {
      const res = await fetch("order/addRoute", {
        method: "post",
        body: JSON.stringify(route),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 401) {
        toast.error(
          "You are not logged in, you need to log in to manage routes"
        );
        history.push("/login");
      }

      return await res.json();
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong add the new route");
    }
  }
);

interface ChangeRouteParam {
  route: Route;
  history: any;
}

export const changeRoute = createAsyncThunk(
  `${namespace}/changeRoute`,
  async ({ route, history }: ChangeRouteParam) => {
    try {
      const res = await fetch("order/changeRoute", {
        method: "post",
        body: JSON.stringify(route),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 401) {
        toast.error(
          "You are not logged in, you need to log in to manage routes"
        );
        history.push("/login");
      }

      return await res.json();
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong changing the route");
    }
  }
);

interface RemoveRouteParam {
  id: number;
  history: any;
}

export const removeRoute = createAsyncThunk(
  `${namespace}/removeRoute`,
  async ({ id, history }: RemoveRouteParam) => {
    try {
      const res = await fetch(`order/removeRoute?id=${id}`, {
        method: "delete",
      });

      if (res.status === 401) {
        toast.error(
          "You are not logged in, you need to log in to manage routes"
        );
        history.push("/login");
      }

      return await res.json();
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong removing the route");
    }
  }
);

const feedSlice = createSlice({
  name: namespace,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getRoutes.fulfilled, (state, { payload }) => {
      state.routes = payload;
      state.routesLoading = false;
    });
    builder.addCase(getRoutes.pending, (state) => {
      state.routesLoading = true;
    });
    builder.addCase(getRoutes.rejected, (state) => {
      state.routesLoading = false;
    });

    builder.addCase(addRoute.fulfilled, (state, { payload }) => {
      state.routes = payload;
      state.routesLoading = false;
    });
    builder.addCase(addRoute.pending, (state) => {
      state.routesLoading = true;
    });
    builder.addCase(addRoute.rejected, (state) => {
      state.routesLoading = false;
    });

    builder.addCase(changeRoute.fulfilled, (state, { payload }) => {
      state.routes = payload;
      state.routesLoading = false;
    });
    builder.addCase(changeRoute.pending, (state) => {
      state.routesLoading = true;
    });
    builder.addCase(changeRoute.rejected, (state) => {
      state.routesLoading = false;
    });

    builder.addCase(removeRoute.fulfilled, (state, { payload }) => {
      state.routes = payload;
      state.routesLoading = false;
    });
    builder.addCase(removeRoute.pending, (state) => {
      state.routesLoading = true;
    });
    builder.addCase(removeRoute.rejected, (state) => {
      state.routesLoading = false;
    });
  },
});

export const useRoutes = (): RouteState["routes"] =>
  useSelector((state: RootState) => state.route.routes);

export const useRoutesLoading = (): RouteState["routesLoading"] =>
  useSelector((state: RootState) => state.route.routesLoading);

export default feedSlice.reducer;
