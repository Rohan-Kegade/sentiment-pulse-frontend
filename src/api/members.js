import { api } from "./client";

export const fetchMembers  = (wsId)              => api.get(`/members/workspace/${wsId}`);
export const inviteMember  = (wsId, data)        => api.post(`/members/workspace/${wsId}`, data);
export const updateMember  = (memberId, patch)   => api.patch(`/members/${memberId}`, patch);
export const removeMember  = (memberId)          => api.delete(`/members/${memberId}`);
