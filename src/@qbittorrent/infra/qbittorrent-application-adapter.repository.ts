import { ApplicationAdapterRepository } from "../../application-adapter/domain/application-adapter.repository.js";
import { ILogger } from "../../logger.js";

type ConnectionOptions = {
  url: string;
  username: string;
  password: string;
};

/**
 * https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)
 */
export class QbittorrentApplicationAdapterRepository implements ApplicationAdapterRepository {
  private static readonly DEFAULT_INTERFACE = "lo";
  
  constructor(
    private readonly logger: ILogger,
    private readonly connectionOptions: ConnectionOptions) {}

  async authenticate(): Promise<string[]> {
    this.logger.info("Authenticating with qBittorrent...");
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
    return response.headers.getSetCookie();
  }
  
  async setPort(port: number, interfaceName: string): Promise<void> {
    const cookies = await this.authenticate();
    this.logger.info("Setting port on qBittorrent %d %s ...", port, interfaceName);
    const jsonPayload = {
      listen_port: port,
      current_network_interface: port > 0 ? interfaceName : QbittorrentApplicationAdapterRepository.DEFAULT_INTERFACE,
      random_port: false,
      upnp: false,
    };
    const response = await fetch(`${this.connectionOptions.url}/api/v2/app/setPreferences`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": cookies.join("; "),
      },
      body: `json=${JSON.stringify(jsonPayload)}`,
    });

    if (!response.ok) {
      throw new Error(`Failed to set port: ${response.statusText}`);
    }
  }
}
