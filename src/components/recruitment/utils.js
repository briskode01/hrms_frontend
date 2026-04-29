// @ts-nocheck
import { AVATAR_COLORS } from "./constants";

export const getAvatarColor = (name = "") =>
    AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

export const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
};
