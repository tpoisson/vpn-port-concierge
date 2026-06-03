import { ApplicationAdapterRepository } from "../../../application-adapter/domain/application-adapter.repository.js";
import { ILogger } from "../../../logger.js";
import { VpnAdapterRepository } from "../../../vpn-adapter/domain/vpn-adapter.repository.js";

export class SyncBetweenVpnAndAppUseCase {
    private static readonly DEFAULT_INTERFACE = "lo";

  constructor(
    private readonly logger: ILogger,
    private readonly vpnAdapterRepository: VpnAdapterRepository,
    private readonly applicationAdapter: ApplicationAdapterRepository
  ) {}

  async execute() {
    const { port, interfaceName } = await this.vpnAdapterRepository.getPort();
    const appInterfaceName = port > 0 ? interfaceName : SyncBetweenVpnAndAppUseCase.DEFAULT_INTERFACE
    this.logger.info("Port received from VPN: %d on interface %s", port, appInterfaceName);
    await this.applicationAdapter.setPort(port, appInterfaceName);
  }
}