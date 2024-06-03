export enum STATUS {
    // 2xx
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NO_CONTENT = 204,
    RESET_CONTENT = 205,
    PARTIAL_CONTENT = 206,

    // 3xx
    MOVED_PERMANENTLY = 301,
    FOUND = 302,

    // 4xx
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    UNSUPPORTED_MEDIA_TYPE = 415,
    UNPROCESSABLE = 422,
    TOO_MANY_REQUESTS = 429,

    // 5xx
    INTERNAL_SERVER_ERROR= 500,
    BAD_GATEWAY = 502,
    SERVICE_UNAVAILABLE = 503,
    GATEWAY_TIME_OUT = 504,
}

export const isSuccessfullResponseCode = (code: number): boolean => {
    return ([200, 201, 202, 203, 204, 205, 206].indexOf(code) > -1);
};
