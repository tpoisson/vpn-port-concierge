
export interface VpnAdapterRepository {
  getPort(): Promise<{ port: number; interfaceName: string }>;
}