export interface ApplicationAdapterRepository {
  setPort(port: number, interfaceName: string): Promise<void>;
}