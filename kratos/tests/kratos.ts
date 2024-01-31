import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { assert } from "chai";
import { Kratos } from "../target/types/kratos";

const { SystemProgram } = anchor.web3

describe("kratos", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.Provider.local();
  anchor.setProvider(provider);
  const program = anchor.workspace.Kratos as Program<Kratos>;

  it("Add ID", async () => {
    const account = anchor.web3.Keypair.generate();
    await program.rpc.addId("Test Document DID", "Test Issuer DID", "Test Holder DID", "Test Expiration Date", {
      accounts: {
        contractAccount: account.publicKey,
        wallet: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId
      },
      signers: [account]
    });

    const test = await program.account.document.fetch(account.publicKey);
    assert.ok(test.documentDid === "Test Document DID");
    assert.ok(test.issuerDid === "Test Issuer DID");
    assert.ok(test.holderDid === "Test Holder DID");
    assert.ok(test.valid === true);
    assert.ok(test.expirationDate === "Test Expiration Date");
  });

  it("Add issuer", async () => {
    const account = anchor.web3.Keypair.generate();
    await program.rpc.addIssuer("Test DID", "Test Issuer", "Test URL", {
      accounts: {
        contractAccount: account.publicKey,
        wallet: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId
      },
      signers: [account]
    });

    const test = await program.account.issuer.fetch(account.publicKey);
    assert.ok(test.did === "Test DID");
    assert.ok(test.issuerName === "Test Issuer");
    assert.ok(test.valid === true);
    assert.ok(test.url === "Test URL");
  });

  it("Add and then invalidate ID", async () => {
    const account = anchor.web3.Keypair.generate();

    await program.rpc.addId("Test Document DID", "Test Issuer DID", "Test Holder DID", "Test Expiration Date", {
      accounts: {
        contractAccount: account.publicKey,
        wallet: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId
      },
      signers: [account]
    });

    let test = await program.account.document.fetch(account.publicKey);
    assert.ok(test.documentDid === "Test Document DID");
    assert.ok(test.issuerDid === "Test Issuer DID");
    assert.ok(test.holderDid === "Test Holder DID");
    assert.ok(test.valid === true);
    assert.ok(test.expirationDate === "Test Expiration Date");

    await program.rpc.invalidateId({
      accounts: {
        contractAccount: account.publicKey,
      }
    });

    test = await program.account.document.fetch(account.publicKey);
    assert.ok(test.documentDid === "Test Document DID");
    assert.ok(test.issuerDid === "Test Issuer DID");
    assert.ok(test.holderDid === "Test Holder DID");
    assert.ok(test.valid === false);
    assert.ok(test.expirationDate === "Test Expiration Date");
  });
});
