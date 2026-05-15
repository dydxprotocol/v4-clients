import type { AxiosResponseHeaders } from 'axios';

export enum RequestMethod {
  POST = 'POST',
  PUT = 'PUT',
  GET = 'GET',
  DELETE = 'DELETE',
}

export interface AxiosResponseWithGeoHeaders<Data> {
  data: Data;
  headers: AxiosResponseHeaders;
}
