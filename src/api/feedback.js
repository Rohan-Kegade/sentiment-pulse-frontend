import { api } from "./client";

export const fetchFeedback = (surveyId)        => api.get(`/feedback/${surveyId}`);
export const createFeedback = (surveyId, data) => api.post(`/feedback/${surveyId}`, data);
