import test, { afterEach, suite, assert } from "node:test";
import { GluetunVpnAdapterRepository } from "../gluetun-vpn-adapter.repository.js";
import vpnSettings from "./fixtures/vpn-settings.json" with { type: "json" };

suite("GluetunVpnAdapterRepository", () => {
  afterEach((t) => {
    if ("mock" in t && t) {
      t.mock.reset();
    }
  });

  test("should get VPN port forwarding configuration", async ({ mock, assert }) => {
    // Given
    const repository = new GluetunVpnAdapterRepository(console, {
      url: "http://localhost:8080",
      apiKey: "test-api-key",
    });
    mock.method(
      repository,
      "getVpnSettings",
      () => vpnSettings,
    );
    mock.method(
      repository,
      "getPortForward",
      async () => ({ port: 12345 }),
    );

    // When
    const result = await repository.getPort();

    // Then
    assert.deepEqual(result, { port: 12345, interfaceName: "tun0" });
  });
});
