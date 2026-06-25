import { api } from "./client";

export const fetchWorkspaces  = ()       => api.get("/workspaces");
export const createWorkspace  = (data)   => api.post("/workspaces", data);
export const deleteWorkspace  = (id)     => api.delete(`/workspaces/${id}`);
