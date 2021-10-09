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

export const addRoute = createAsyncThunk(
  `${namespace}/addRoute`,
  async (route: Omit<Route, "id">) => {
    try {
      const res = await fetch("order/addRoute", {
        method: "post",
        body: JSON.stringify(route),
        headers: {
          "Content-Type": "application/json",
        },
      });
      return await res.json();
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong add the new route");
    }
  }
);

export const changeRoute = createAsyncThunk(
  `${namespace}/changeRoute`,
  async (route: Route) => {
    try {
      const res = await fetch("order/changeRoute", {
        method: "post",
        body: JSON.stringify(route),
        headers: {
          "Content-Type": "application/json",
        },
      });
      return await res.json();
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong changing the route");
    }
  }
);

export const removeRoute = createAsyncThunk(
  `${namespace}/removeRoute`,
  async (id: number) => {
    try {
      const res = await fetch(`order/removeRoute?id=${id}`, {
        method: "delete",
      });
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
