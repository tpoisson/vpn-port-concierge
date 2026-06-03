# vpn-port-concierge

Polls your VPN app every 10 seconds to get port forwarding information and push it to your torrent service app.

If port is valid, set the config to the torrent client.
If port is not valid, blocks traffic of torrent client.

## Usage

### 1. Run with Docker Compose

```yaml
  vpn-port-concierge:
    image: ghcr.io/tpoisson/vpn-port-concierge:latest
    container_name: vpn-port-concierge
    environment:
        - GLUETUN_URL=http://gluetun:8000
        - GLUETUN_API_KEY=GLUETUN-API-KEY # optional, read https://github.com/qdm12/gluetun-wiki/blob/main/setup/advanced/control-server.md#authentication
        - QBITTORRENT_URL=http://qbitorrent:9090
        - QBITTORRENT_WEB_UI_USERNAME=
        - QBITTORRENT_WEB_UI_PASSWORD=
        - QBITTORRENT_API_KEY= # for qbittorrent >= 5.2.0, see https://github.com/qbittorrent/qBittorrent/wiki/API-Key-Authentication-(%E2%89%A5v5.2.0)
```

Currently tested with 
- Gluetun 3.41.1
- qBittorrent 5.2.1
- ProtonVPN with wireguard