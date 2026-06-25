import { api } from "./client";

export const fetchWorkspaces  = ()            => api.get("/workspaces");
export const createWorkspace  = (data)        => api.post("/workspaces", data);
export const renameWorkspace  = (id, name)    => api.patch(`/workspaces/${id}`, { name });
export const deleteWorkspace  = (id)          => api.delete(`/workspaces/${id}`);
