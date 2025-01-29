/* eslint-disable @typescript-eslint/no-explicit-any */

import _superagent from "superagent";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const SuperagentPromise = require("superagent-promise");
const superagent = SuperagentPromise(_superagent, global.Promise);

export const API_ROOT = "http://192.168.1.44:3001/";
export const BUCKET_ROOT =
  "https://demoserver3.sgp1.digitaloceanspaces.com/uploads/images";
export const PINECONE_ROOT = "https://dev.qixs.ai:3003/";

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
  setToken: (_token?: string) => {
    token = _token;
  },
};

export default henceforthApi;
