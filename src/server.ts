import { GluetunVpnAdapterRepository } from "./@gluetun/infra/gluetun/gluetun-vpn-adapter.repository.js";
import { QbittorrentApplicationAdapterRepository } from "./@qbittorrent/infra/qbittorrent-application-adapter.repository.js";
import { SyncBetweenVpnAndAppUseCase } from "./port-syncer/application/use-cases/sync-between-vpn-and-app.use-case.js";
import { log } from "./logger.js";
import "dotenv/config";

const main = async () => {
  const vpnAdapterRepository = new GluetunVpnAdapterRepository(log, {
    url: process.env.GLUETUN_URL!,
    apiKey: process.env.GLUETUN_API_KEY!,
  });
  const applicationAdapterRepository =
    new QbittorrentApplicationAdapterRepository(log, {
      url: process.env.QBITTORRENT_URL!,
      username: process.env.QBITTORRENT_WEB_UI_USERNAME!,
      password: process.env.QBITTORRENT_WEB_UI_PASSWORD!,
      apiKey: process.env.QBITTORRENT_API_KEY!,
    });

  const syncBetweenVpnAndAppUseCase = new SyncBetweenVpnAndAppUseCase(
    log,
    vpnAdapterRepository,
    applicationAdapterRepository,
  );
  await syncBetweenVpnAndAppUseCase.execute();
};

let running = false;
const run = async () => {
  if (running) return;
  running = true;
  try {
    await main();
  } catch (error) {
    log.error(error, `Sync failed`);
  } finally {
    running = false;
  }
};

run();
setInterval(run, 10_000);
