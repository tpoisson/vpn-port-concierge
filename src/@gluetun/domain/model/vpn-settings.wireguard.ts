export interface VpnSettingsWireguard {
  type: "wireguard";
  provider: unknown;
  openvpn: unknown;
  wireguard: {
    private_key: string;
    pre_shared_key: string;
    addresses: string[];
    allowed_ips: string[];
    interface: string;
    persistent_keep_alive_interval: number;
    mtu: number;
    implementation: string;
  };
}
