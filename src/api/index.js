// src/api/index.js
import * as mock from "./mock.js";
import * as real from "./real.js";

const devHosts = ["localhost", "127.0.0.1"];
const isDevHost = devHosts.includes(location.hostname);

const useMockFlag = import.meta.env.VITE_USE_MOCK === "true";

const USE_MOCK = isDevHost || useMockFlag;

// ============ DASHBOARD (cũ) ============
export const getDashboardData =
  USE_MOCK ? mock.getDashboardData : real.getDashboardData;

export const getTodayEvents =
  USE_MOCK ? mock.getTodayEvents : real.getTodayEvents;

// ============ THÊM CHO EDITOR ============
export const saveDraft =
  USE_MOCK ? mock.saveDraft : real.saveDraft;

export const getArticle =
  USE_MOCK ? mock.getArticle : real.getArticle;

export const submitArticle =
  USE_MOCK ? mock.submitArticle : real.submitArticle;

export const getComments =
  USE_MOCK ? mock.getComments : real.getComments;

export const addComment =
  USE_MOCK ? mock.addComment : real.addComment;
// ========================================

console.log("API mode:", USE_MOCK ? "MOCK" : "REAL");
