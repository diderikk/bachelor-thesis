import ENV from "../config/env";
import { FetchError } from "../errors/FetchError";

class Fetch {
  private static instance: Fetch;
  private url: string;
  private defaultHeaders: HeadersInit_ = {
    'Content-Type': 'application/json',
  }

  private constructor(url: string) {
    this.url = url;
  }

  private handleRespone(response: Response) {
    if(response.ok) return response.json()
    throw new FetchError("Fetched request returned error", response.status)
  }

  public static create(url: string) {
    if (!this.instance) {
      this.instance = new Fetch(url);
    }
    return this.instance;
  }

  public async post(uri: string, body: Object, options?: RequestInit) {
    return await fetch(this.url + uri, {
      method: 'POST',
      headers: this.defaultHeaders,
      body: JSON.stringify(body),
      ...options,
    }).then(this.handleRespone);
  }

  public async get(uri: string, options?: RequestInit) {
    return await fetch(this.url + uri, {
      method: 'GET',
      headers: this.defaultHeaders,
      ...options,
    }).then(this.handleRespone);
  }

  public async delete(uri: string, body?: Object, options?: RequestInit) {
    return await fetch(this.url + uri, {
      method: 'DELETE',
      headers: this.defaultHeaders,
      body: JSON.stringify(body),
      ...options,
    }).then(this.handleRespone);
  }
}

const fetchInstance = Fetch.create(`http://${ENV.BACKEND_URL}/api/v1/`);

export default fetchInstance;
