const BaseUrl = "http://localhost:5281";

const ApiServerV1 = BaseUrl + "/api/server/v1";

export const QuizRequestServerApiV1 = ApiServerV1+"/quiz-request";

export const QuizSumbitServerApiV1 = ApiServerV1+"/quiz-submit";

export const QuizTestServerApiV1 = ApiServerV1+"/test";

export const QuizSecureTestServerApiV1 = ApiServerV1+"/secure/test";

const JwtEndpoint = "/jwt";

export const LoginServerApiV1 = ApiServerV1+JwtEndpoint+"/login";

export const RefreshTokenServerApiV1 = ApiServerV1+JwtEndpoint+"/refresh-token";

const UserEndpoint = "/user";

export const LogoutServerApiV1 = ApiServerV1+UserEndpoint+"/logout";

export const UserClientDataServerApiV1 = ApiServerV1+UserEndpoint+"/user-client-data";

export const UserProfileDailyCheckServerApiV1 = ApiServerV1+UserEndpoint+"/user-profile-daily-check";

export const UserDeleteServerApiV1 = ApiServerV1+UserEndpoint+"/user-delete";

export const UserPreviousLoginServerApiV1 = ApiServerV1 + UserEndpoint + "/user-login-session";