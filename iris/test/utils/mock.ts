import { Program, Provider } from "@project-serum/anchor";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import idl from "../../src/interfaces/kratos/kratos.json";
import { ConfirmOptions, Connection, Keypair } from "@solana/web3.js";
import API from "../../src/config/anchor";
import { Kratos } from "../../src/interfaces/kratos/kratos";

const mockedAPI = API.connect as jest.MockedFunction<typeof API.connect>;

const mockPromise = (): Promise<Program<Kratos>> =>
  new Promise((resolve, reject) => {
    const wallet = new NodeWallet(
      Keypair.fromSecretKey(
        Uint8Array.from([
          151, 237, 225, 173, 175, 229, 41, 22, 186, 31, 59, 21, 138, 248, 140,
          79, 161, 113, 226, 207, 74, 158, 164, 133, 246, 198, 114, 94, 89, 196,
          234, 62, 93, 121, 1, 187, 107, 91, 44, 2, 86, 126, 87, 101, 174, 90,
          83, 172, 170, 127, 23, 147, 202, 14, 121, 20, 97, 24, 51, 175, 242,
          231, 140, 141,
        ])
      )
    );

    const opts: ConfirmOptions = {
      preflightCommitment: "processed",
    };

    const connection = new Connection("https://api.testnet.solana.com", opts);
    const provider = new Provider(connection, wallet, opts);
    resolve(new Program(idl as any as Kratos, idl.metadata.address, provider));
  });

export const mockConnection = () => {
  mockedAPI.mockImplementation(() => mockPromise());
};
