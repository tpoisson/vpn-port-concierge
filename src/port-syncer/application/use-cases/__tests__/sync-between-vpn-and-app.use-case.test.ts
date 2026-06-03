import { suite, test } from "node:test";
import assert from "node:assert/strict";
import { SyncBetweenVpnAndAppUseCase } from "../sync-between-vpn-and-app.use-case.js";

suite("SyncBetweenVpnAndAppUseCase", () => {
  test("forwards the VPN port and interface to the application adapter", async ({ mock }) => {
    // Given
    const getPort = mock.fn(async () => ({ port: 51413, interfaceName: "tun0" }));
    const setPort = mock.fn(async () => {});

    const useCase = new SyncBetweenVpnAndAppUseCase(
      { info: () => {}, error: () => {}, warn: () => {}, debug: () => {} },
      { getPort },
      { setPort },
    );

    // When
    await useCase.execute();

    // Then
    assert.equal(setPort.mock.calls.length, 1);
    assert.deepEqual(setPort.mock.calls[0].arguments, [51413, "tun0"]);
  });

  test("uses loopback interface when VPN returns port 0", async ({ mock }) => {
    // Given
    const setPort = mock.fn(async () => {});
    const useCase = new SyncBetweenVpnAndAppUseCase(
      { info: () => {}, error: () => {}, warn: () => {}, debug: () => {} },
      { getPort: mock.fn(async () => ({ port: 0, interfaceName: "tun0" })) },
      { setPort },
    );

    // When
    await useCase.execute();

    // Then
    assert.equal(setPort.mock.calls.length, 1);
    assert.deepEqual(setPort.mock.calls[0].arguments, [0, "lo"]);
  });
});
