/* eslint-disable @typescript-eslint/no-explicit-any */

import { request } from "http";
import _superagent from "superagent";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const SuperagentPromise = require("superagent-promise");
const superagent = SuperagentPromise(_superagent, global.Promise);

export const API_ROOT = "https://qixs.ai:3001/";
export const BUCKET_ROOT =
  "https://demoserver3.sgp1.digitaloceanspaces.com/uploads/images";
export const PINECONE_ROOT = "https://qixs.ai:3001/";

const API_FILE_ROOT_MEDIUM = `${BUCKET_ROOT}/medium/`;
const API_FILE_ROOT_ORIGINAL = `${BUCKET_ROOT}/original/`;
const API_FILE_ROOT_SMALL = `${BUCKET_ROOT}/small/`;
const API_FILE_ROOT_AUDIO = `${BUCKET_ROOT}/audio/`;
const API_FILE_ROOT_VIDEO = `${BUCKET_ROOT}/video/`;
const API_FILE_ROOT_DOCUMENTS = `${BUCKET_ROOT}/documents/`;
const API_FILE_ROOT_DB_BACKUP = `${BUCKET_ROOT}/backup/`;
const API_FILE_ROOT_DOCS = `${BUCKET_ROOT}/docs/`;

const encode = encodeURIComponent;
const responseBody = (res: any) => res.body;

let token: any = null;
const tokenPlugin = (req: any) => {
  if (token) {
    req.set("Authorization", `Bearer ${token}`);
  }
};

const requests = {
  del: (url: string, body: string) =>
    superagent
      .del(`${API_ROOT}${url}`, body)
      .use(tokenPlugin)
      .then(responseBody),
  deleteOne: (url: string) =>
    superagent.del(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  delMultiple: (url: string, body: any) =>
    superagent
      .del(`${API_ROOT}${url}`, body)
      .use(tokenPlugin)
      .then(responseBody),
  get: (url: string) =>
    superagent.get(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  put: (url: string, body: any) =>
    superagent
      .put(`${API_ROOT}${url}`, body)
      .use(tokenPlugin)
      .then(responseBody),
  patch: (url: string, body: any) =>
    superagent
      .patch(`${API_ROOT}${url}`, body)
      .use(tokenPlugin)
      .then(responseBody),
  post: (url: string, body: any) =>
    superagent
      .post(`${API_ROOT}${url}`, body)
      .use(tokenPlugin)
      .then(responseBody),
  file: (url: string, key: string, file: any) =>
    superagent
      .post(`${API_ROOT}${url}`)
      .attach(key, file)
      .use(tokenPlugin)
      .then(responseBody),

  fileWithBody: (url: string, key: string, file: any, body: any) => {
    const req = superagent.post(`${API_ROOT}${url}`).use(tokenPlugin);
    Object.keys(body).forEach((field) => {
      req.field(field, body[field]);
    });
    return req.attach(key, file).then(responseBody);
  },
};

const SuperAdmin = {
  login: (info: any) => requests.post("admin/login", info),
  profile: () => requests.get(`admin/profile`),
  updateProfile: (info: any) => requests.put("admin/profile", info),
  updatePassword: (info: any) => requests.put("admin/password", info),
  createWorkspace: (info: any) => requests.post("admin/workspace/create", info),
  generateSecretKey: (info?: any) => requests.get("admin/secret/gen-key"),
  getMyWorkspaces: (q?: any) => requests.get("admin/my-workspace"),

  //for agent listing
  getPhoneNumbers: (q?: any) => requests.get(`admin/twilio/numbers`),

  //dashboard
  getDashboardStats: (q: any) =>
    requests.get(`admin/dashboard/overview${q ? `?${q}` : ""}`),

  getSubscriptionListing: (q: any) =>
    requests.get(`admin/dashboard/subscription${q ? `?${q}` : ""}`),
  getDashboardVendorListing: (q: any) =>
    requests.get(`admin/dashboard/vendors${q ? `?${q}` : ""}`),

  //vendors
  vendorListing: (q: any) => requests.get(`admin/vendor${q ? `?${q}` : ""}`),
  vendorDetail: (id: string) => requests.get(`admin/vendor/${id}`),
  toogleVendorStatus: (id: string, status: string) =>
    requests.patch(`admin/vendor/${id}/block?status=${status}`, {}),

  //workspaces
  workspaceListing: (q: any) =>
    requests.get(`admin/workspace${q ? `?${q}` : ""}`),
  getWorkspaceMembersListing: (id: string, q: any) =>
    requests.get(`admin/workspace/${id}/users${q ? `?${q}` : ""}`),
  getWorkspaceSubscriptionListing: (id: string, q: any) =>
    requests.get(`admin/workspace/${id}/subscription${q ? `?${q}` : ""}`),

  workspaceDetails: (id: string) => requests.get(`admin/workspace/${id}`),
  toggleWorkspaceStatus: (id: string, status: string) =>
    requests.put(`admin/workspace/${id}/block?status=${status}`, {}),

  //imageupload
  imageUpload: (info: any) => requests.post("upload/file", info),

  //knowledgebase
  getKnowledgeBases: (q?: any) =>
    requests.get(`admin/knowledge-base${q ? `?${q}` : ""}`),

  //agent-templates
  addAgentTemplate: (info: any) => requests.post("admin/ai-agent", info),
  agentTemplateListing: (q: any) =>
    requests.get(`admin/ai-agent${q ? `?${q}` : ""}`),
  getAgentTemplateDetails: (id: string) => requests.get(`admin/ai-agent/${id}`),
  updateAgentTemplate: (id: string, info: any) =>
    requests.put(`admin/ai-agent/${id}`, info),
  deleteAgentTemplate: (id: string) =>
    requests.deleteOne(`admin/ai-agent/${id}`),

  //default test agent

  defaultAgentListing: (q: any) =>
    requests.get(`admin/ai-agent/default/list${q ? `?${q}` : ""}`),
  addDefaultAgent: (info: any) => requests.post("admin/default-agent", info),
  getDefaultAgentDetails: (id: string) =>
    requests.get(`admin/default-agent/${id}`),
  updateDefaultAgent: (id: string, info: any) =>
    requests.put(`admin/default-agent/${id}`, info),
  deleteDefaultAgent: (id: string) =>
    requests.deleteOne(`admin/default-agent/${id}`),
  agentPieChartData: (id: any) => requests.get(`admin/ai-agent/${id}/charts`),
  updateAgentStatus: (id: string, info: any) =>
    requests.put(`admin/agent/${id}/status/${info.status}`, info),
  getAgent: (id: any) => requests.get(`agent/${id}`),
  agentChatLogs: (id: string, info: any) =>
    requests.get(`admin/ai-agent/${id}/logs?type=CHAT&${info}`),
  agentCallLogs: (id: string, info: any) =>
    requests.get(`admin/ai-agent/${id}/logs?type=CALL&${info}`),
  agentVoiceChatLogs: (id: string, info: any) =>
    requests.get(`admin/ai-agent/${id}/logs?type=VOICE_CHAT&${info}`),

  //default agent scripts
  generateScript: (id: any, info: any) =>
    requests.post(`admin/ai-agent/${id}/script`, info),
  updateScript: (id: any, info: any) =>
    requests.put(`admin/ai-agent/${id}/script`, info),
  // getGeneratedScript: (id: any) => requests.get(`admin/ai-agent/${id}/script`),
  // deleteScript: (workspace_id: any, script_id: any) =>
  //   requests.deleteOne(`admin/workspace/${workspace_id}/script/${script_id}`),

  deactivateScript: (agent_id: any, script_id: any, info: any) =>
    requests.patch(`admin/ai-agent/${agent_id}/script/${script_id}`, info),

  //website-testing
  websiteTesting: (info: any) => requests.put("agent/default/web", info),
  websiteTestingListing: (q?: any) =>
    requests.get(`agent/default/web${q ? `?${q}` : ""}`),

  //call testing
  defaultCallData: () => requests.get(`twilio/default-call-data`),
  callTesting: (info: any) => requests.post("twilio/send-call-admin", info),

  //twilio

  addTwilioNumber: (info: any) => requests.post(`admin/twilio/account`, info),
  getTwilioNumbers: (q?: any) => requests.get(`admin/twilio/account${q}`),
  deleteTwilioNumber: (id: string) =>
    requests.deleteOne(`admin/twilio/account/${id}`),

  //keylisitng
  keyListing: (id: any) => requests.get(`admin/workspace/${id}/key`),

  generateKey: (id: any) => requests.post(`admin/workspace/${id}/key`, {}),
  getGeneratedKey: (id: any) => requests.get(`admin/workspace/${id}/key`),
  deleteKey: (id: any) => requests.deleteOne(`admin/workspace/${id}/key`),

  //whitelist data
  whiteLabelListing: (q?: any) =>
    requests.get(`admin/white-label${q ? `?${q}` : ""}`),

  //ticket listing
  getTickets: (q?: any) => requests.get(`admin/contactus${q ? `?${q}` : ""}`),
  getTicketDetails: (id: string) => requests.get(`admin/contactus/${id}`),
  updateTicketStatus: (id: string, info: any) =>
    requests.put(`admin/contactus/${id}`, info),
  deleteTicket: (id: string) => requests.deleteOne(`admin/contactus/${id}`),

  // ---------------*** Settings ***--------------------
  //staff
  staffListing: (q: any) => requests.get(`admin/staff/list${q ? `?${q}` : ""}`),
  createStaff: (info: any) => requests.post("admin/staff", info),
  editStaff: (id: string, info: any) => requests.put(`admin/staff/${id}`, info),
  getStaffDetails: (id: string) => requests.get(`admin/staff/${id}`),
  deleteStaff: (id: string) => requests.deleteOne(`admin/staff/${id}`),

  //page-management
  contentPageListing: (q?: any) =>
    requests.get(`admin/content${q ? `?${q}` : ""}`),
  getPageContent: (id: string) => requests.get(`admin/content/${id}`),
  updatePageContent: (info: any) => requests.put(`admin/content`, info),
  createNewPage: (info: any) => requests.post("admin/content", info),

  //notification
  vendorNotificationListing: (q: any) =>
    requests.get(`admin/notification/vendor${q ? `?${q}` : ""}`),
  sendNotification: (info: any) =>
    requests.post("admin/notification/send", info),
};

const KB = {
  post: (url: string, key: string, value: any, body: any) =>
    requests.fileWithBody(`${url}`, key, value, body),
  postDocument: (url: string, info: any) => requests.post(url, info),
  createKnowledgeBase: (info: any) =>
    requests.post(`admin/knowledge-base`, info),
  deleteDocuments: () => requests.deleteOne(`admin/pinecone/document`),
  getKnowledgeBases: (q?: any) =>
    requests.get(`admin/knowledge-base${q ? `?${q}` : ""}`),
  getDocuments: (id: any, q?: any) =>
    requests.get(`admin/knowledge-base/${id}/documents${q ? `?${q}` : ""}`),
  deleteKnowledgeBase: (id: any) =>
    requests.deleteOne(`admin/knowledge-base/${id}`),
  // getDocument: (url: string) => requests.get(url),
  addUrlDocument: (info: any) =>
    requests.post(`admin/knowledge-base/url-upload`, info),
  textUpload: (info: any) =>
    requests.post(`admin/knowledge-base/text-upload`, info),
  deleteKbDocuments: (id: any) =>
    requests.deleteOne(`admin/knowledge-base/documents/${id}`),
};

const Auth = {
  login: (info: any) => requests.post("user/login", info),
  signUp: (info: any) => requests.post("user/signUp", info),
  socialLogin: (info: any) => requests.post("login", info),
  addDoc: (info: any) => requests.post("user/ids", info),
  editDoc: (id: string, info: any) => requests.put(`user/ids/${id}`, info),
  getDoc: () => requests.get(`user/ids`),
  checkEmail: (value: string) =>
    requests.get(`user/email/exist?email=${value}`),
  // delDoc: (id: string) => requests.del(`user/ids/${id}`),
  logout: () => requests.put("user/logout", {}),
  changePassword: (info: any) => requests.put("admin/change-password", info),
  profile: () => requests.get(`user/profile`),
  forgotPassword: (value: any) => requests.put("user/forget/password", value),
  resendOtp: (value: any) => requests.post("user/resend/email/otp", value),
  resendOtpPhone: (value: any) => requests.put("user/resend/phone/otp", value),
  verifyOtp: (info: any) => requests.post("user/otp/verify", info),
  verifyEmail: (info: any) => requests.post("user/verify/email", info),
  verifyPhone: (info: any) => requests.post("user/verify/phone", info),
  resetPassword: (info: any) => requests.put("user/reset/password", info),
  edit: (info: any) => requests.put("user/profile", info),
};

const FILES = {
  audio: (filename: string) =>
    filename?.startsWith("http")
      ? filename
      : `${API_FILE_ROOT_AUDIO}${filename}`,
  video: (filename: string) =>
    filename?.startsWith("http")
      ? filename
      : `${API_FILE_ROOT_VIDEO}${filename}`,
  imageOriginal: (filename: string, alt?: any) =>
    filename
      ? filename?.startsWith("http")
        ? filename
        : `${API_FILE_ROOT_ORIGINAL}${filename}`
      : alt,
  imageMedium: (filename: string, alt: any) =>
    filename
      ? filename?.startsWith("http")
        ? filename
        : `${API_FILE_ROOT_MEDIUM}${filename}`
      : alt,
  imageSmall: (filename: string, alt?: any) =>
    filename
      ? filename?.startsWith("http")
        ? filename
        : `${API_FILE_ROOT_SMALL}${filename}`
      : alt,

  document: (filename: string, alt?: any) =>
    filename
      ? filename?.startsWith("http")
        ? filename
        : `${API_FILE_ROOT_DOCUMENTS}${filename}`
      : alt,
};

const henceforthApi = {
  Auth,
  API_ROOT,
  API_FILE_ROOT_DB_BACKUP,
  API_FILE_ROOT_SMALL,
  API_FILE_ROOT_MEDIUM,
  API_FILE_ROOT_DOCS,
  API_FILE_ROOT_ORIGINAL,
  API_FILE_ROOT_VIDEO,
  API_FILE_ROOT_DOCUMENTS,
  SuperAdmin,
  BUCKET_ROOT,
  FILES,
  token,
  encode,
  KB,
  setToken: (_token?: string) => {
    token = _token;
  },
};

export default henceforthApi;
