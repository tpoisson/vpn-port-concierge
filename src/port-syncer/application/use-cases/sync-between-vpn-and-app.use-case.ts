import { ApplicationAdapterRepository } from "../../../application-adapter/domain/application-adapter.repository.js";
import { ILogger } from "../../../logger.js";
import { VpnAdapterRepository } from "../../../vpn-adapter/domain/vpn-adapter.repository.js";

export class SyncBetweenVpnAndAppUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly vpnAdapterRepository: VpnAdapterRepository,
    private readonly applicationAdapter: ApplicationAdapterRepository
  ) {}

  async execute() {
    const { port, interfaceName } = await this.vpnAdapterRepository.getPort();
    this.logger.info("Port received from VPN: %d on interface %s", port, interfaceName);
    await this.applicationAdapter.setPort(port, interfaceName);
  }
}