import fs from "fs";
import * as grpc from "@grpc/grpc-js";
import * as crypto from "crypto";
import {
  connect,
  signers,
  type Gateway,
  type Contract,
} from "@hyperledger/fabric-gateway";

type FabricContext = {
  client: grpc.Client;
  gateway: Gateway;
  contract: Contract;
};

let cached: FabricContext | null = null;

export function getEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export async function getFabric(): Promise<FabricContext> {
  if (cached) return cached;

  const peerEndpoint = getEnv("FABRIC_PEER_ENDPOINT");
  const peerHostAlias = getEnv("FABRIC_PEER_HOST_ALIAS");

  const tlsCertPath = getEnv("FABRIC_TLS_CERT");
  let tlsRootCert: Buffer;

  try {
    tlsRootCert = fs.readFileSync(tlsCertPath);
  } catch (error) {
    throw new Error(
      `Failed to read TLS certificate from ${tlsCertPath}: ${error}`
    );
  }

  // gRPC connection to peer gateway (TLS)
  // Create SSL credentials with certificate
  const sslCredentials = grpc.credentials.createSsl(tlsRootCert);

  const client = new grpc.Client(peerEndpoint, sslCredentials, {
    // Localhost + TLS CN uyuşmazlığı için:
    "grpc.ssl_target_name_override": peerHostAlias,
    "grpc.default_authority": peerHostAlias,
  });

  const mspId = getEnv("FABRIC_MSP_ID");
  const certPath = getEnv("FABRIC_CERT");
  const keyPath = getEnv("FABRIC_KEY");

  const credentials = fs.readFileSync(certPath);
  const privateKeyPem = fs.readFileSync(keyPath);
  const privateKey = crypto.createPrivateKey(privateKeyPem);

  const identity = { mspId, credentials };
  const signer = signers.newPrivateKeySigner(privateKey);

  // Gateway connect → network → contract
  const gateway = connect({ client, identity, signer });
  const network = gateway.getNetwork(getEnv("FABRIC_CHANNEL"));
  const contract = network.getContract(getEnv("FABRIC_CHAINCODE"));

  cached = { client, gateway, contract };
  return cached;
}

export async function closeFabric(): Promise<void> {
  if (!cached) return;
  cached.gateway.close();
  cached.client.close();
  cached = null;
}
