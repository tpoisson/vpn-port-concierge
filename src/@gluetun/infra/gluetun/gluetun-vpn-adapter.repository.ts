import { ILogger } from "../../../logger.js";
import { VpnAdapterRepository } from "../../../vpn-adapter/domain/vpn-adapter.repository.js";
import { VpnSettingsWireguard } from "../../domain/model/vpn-settings.wireguard.js";

type GluetunConnectionOptions = {
  url: string;
  apiKey: string;
};
export class GluetunVpnAdapterRepository implements VpnAdapterRepository {
  constructor(
    private readonly logger: ILogger,
    private readonly gluetunConnectionOptions: GluetunConnectionOptions,
  ) {
    logger.info(
      `GluetunVpnAdapterRepository initialized with URL: ${this.gluetunConnectionOptions.url}`,
    );
  }

  async getVpnSettings() {
    this.logger.info("Getting VPN settings from Gluetun...");
    const response = await fetch(
      this.gluetunConnectionOptions.url + "/v1/vpn/settings",
      {
        headers: {
          "X-Api-Key": this.gluetunConnectionOptions.apiKey,
        },
      },
    );
    const body = (await response.json()) as VpnSettingsWireguard;
    return body;
  }

  async getPortForward(): Promise<{ port: number }> {
    const response = await fetch(
      this.gluetunConnectionOptions.url + "/v1/portforward",
      {
        headers: {
          "X-Api-Key": this.gluetunConnectionOptions.apiKey,
        },
      },
    );
    return (await response.json()) as { port: number };
  }

  async getPort(): Promise<{ port: number; interfaceName: string }> {
    this.logger.info("Getting port from Gluetun...");

    const vpnSettings = await this.getVpnSettings();
    const { port } = await this.getPortForward();
    return { port, interfaceName: vpnSettings.wireguard.interface };
  }
}
