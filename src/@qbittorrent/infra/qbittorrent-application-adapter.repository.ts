import { ApplicationAdapterRepository } from "../../application-adapter/domain/application-adapter.repository.js";
import { ILogger } from "../../logger.js";

type ConnectionOptions = {
  url: string;
} & ({
  apiKey: string;
} | {
  username: string;
  password: string;
});

/**
 * https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)
 */
export class QbittorrentApplicationAdapterRepository implements ApplicationAdapterRepository {
  
  constructor(
    private readonly logger: ILogger,
    private readonly connectionOptions: ConnectionOptions) {}

  async authenticate(): Promise<Record<string, string>> {
    this.logger.info("Authenticating with qBittorrent...");

    // https://github.com/qbittorrent/qBittorrent/wiki/API-Key-Authentication-(%E2%89%A5v5.2.0)
    if ('apiKey' in this.connectionOptions) {
      return {
        "Authorization": `Bearer ${this.connectionOptions.apiKey}`,
      };
    }

    const response = await fetch(`${this.connectionOptions.url}/api/v2/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `username=${this.connectionOptions.username}&password=${this.connectionOptions.password}`,
    });

    if (!response.ok) {
      throw new Error(`Failed to authenticate: ${response.statusText}`);
    }
    return {
      "Cookie": response.headers.getSetCookie().join("; "),
    };
  }
  
  async setPort(port: number, interfaceName: string): Promise<void> {
    const authHeaders = await this.authenticate();
    this.logger.info("Setting port on qBittorrent %d %s ...", port, interfaceName);
    const jsonPayload = {
      listen_port: port,
      current_network_interface: interfaceName,
      random_port: false,
      upnp: false,
    };
    const response = await fetch(`${this.connectionOptions.url}/api/v2/app/setPreferences`, {
      method: "POST",
      headers: {
        ...authHeaders,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `json=${JSON.stringify(jsonPayload)}`,
    });

    if (!response.ok) {
      throw new Error(`Failed to set port: ${response.statusText}`);
    }
  }
}
