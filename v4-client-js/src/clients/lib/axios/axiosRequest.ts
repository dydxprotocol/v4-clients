import axios, { AxiosRequestConfig } from 'axios';

import { Data } from '../../types';
import { AxiosServerError, AxiosError } from './errors';
import { RequestMethod } from './types';

export interface Response {
  status: number;
  data: Data;
  headers: {};
}

async function axiosRequest(options: AxiosRequestConfig): Promise<Response> {
  try {
    return await axios(options);
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'isAxiosError' in error) {
      // @eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axiosErr = error as any;
      if (axiosErr.response) {
        throw new AxiosServerError(axiosErr.response, axiosErr);
      }
      throw new AxiosError(`Axios: ${axiosErr.message}`, axiosErr);
    }
    throw error;
  }
}

export function request(
  url: string,
  method: RequestMethod = RequestMethod.GET,
  body?: unknown | null,
  headers: {} = {},
): Promise<Response> {
  return axiosRequest({
    url,
    method,
    data: body,
    headers,
  });
}
