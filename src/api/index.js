import * as mock from "./mock.js";
import * as real from "./real.js";

const devHosts = ["localhost", "127.0.0.1"];
const isDevHost = devHosts.includes(location.hostname);

const useMockFlag = import.meta.env.VITE_USE_MOCK === "true";

const USE_MOCK = isDevHost || useMockFlag;

export const getDashboardData = USE_MOCK ? mock.getDashboardData : real.getDashboardData;
export const getTodayEvents = USE_MOCK ? mock.getTodayEvents : real.getTodayEvents;

console.log("API mode:", USE_MOCK ? "MOCK" : "REAL");
