import { api } from "./client";

export const fetchSurveys    = (wsId)           => api.get(`/surveys/workspace/${wsId}`);
export const createSurvey    = (data)           => api.post("/surveys", data);
export const updateSurvey    = (id, patch)      => api.put(`/surveys/${id}`, patch);
export const deleteSurvey    = (id)             => api.delete(`/surveys/${id}`);
