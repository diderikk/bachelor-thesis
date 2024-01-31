# **Kratos**

The blockchain in the Digital ID Wallet's ecosystem. Used as a decentralized ledger for saving agreements between ID issuers and ID holders. Kratos is written using Anchor, a framework for the Solana blockchain.  
Made by:

- [RokasBliu](https://github.com/RokasBliu)
- [hamasl](https://github.com/hamasl)
- [diderikk](https://github.com/diderikk)

More about:

- [Solana](https://docs.solana.com)
- [Anchor](https://project-serum.github.io/anchor/)

## **Content**

1. [Description](#description)
2. [Dependencies](#dependencies)
3. [Important notice](#important-notice)
4. [Setup](#setup)
5. [Makefile](#makefile)
6. [Testing](#testing)

## **Description**

Kratos is the blockchain in the Digital ID Wallet's ecosystem, used as a decentralized ledger for saving agreements on the Solana blockchain. Currently, Kratos itself is a program, which can also be called a smart contract. In Solana, a program stores states between transactions using accounts, and in Kratos there are two types of accounts: One for issuer agreements and one for ID agreements. Currently there are three "functions" implemented in Kratos: Adding an ID agreement, adding an issuer agreement and invalidating an ID agreement. The function for adding an ID agreement is used when an issuer creates/issues an ID using the project's backend (Iris). The function for invalidating an ID is used when an issuer revokes a document, or when the holder deletes the ID themselves. Lastly, the function for adding an issuer is used when an issuer registers themselves to the ecosystem via the backend (Iris) with the purpose of being visable and available options for the application's users when adding an ID. Kratos uses RPC requests to communicate with Iris.

## **Important notice**

A working version of Kratos is already deployed on Solana's testnet. This means that there is no need to run Kratos locally for the Digital ID Wallet ecosystem to function, which means that the remaining sections can be skipped. However, it is important to read the remaining sections if one wishes to run Kratos locally, or to deploy an updated version to the testnet (or somewhere else e.g., mainnet). Remember that Kratos is communicating with Iris, meaning that if an updated version of Kratos is deployed (on e.g. testnet), it might break the communication, therefore test locally before deploying to public clusters.

## **Dependencies**

Make sure to install these dependencies:

- [Node.js](https://nodejs.org/en/)
- [Solana Tool Suite](https://docs.solana.com/cli/install-solana-cli-tools)
- [Anchor (Solana framework)](https://project-serum.github.io/anchor/getting-started/installation.html)

## **Setup**

Before proceeding, make sure that Nodejs, Solana and Anchor are installed (see section about [Dependencies](#dependencies)).

### **Create Anchor.toml file**

After the project is cloned, some changes and additions are needed. Firstly, the Anchor.toml file needs to be created. This can be done with two different methods.

#### **By using Makefile (method 1)**

Run the following command inside the project's root directory:

```bash
make create_toml
```

A new file called Anchor.toml should be created. Also, a pubkey is printed out in the terminal. Make sure to copy the pubkey and paste it into programs/kratos/src/lib.rs as a parameter for the declare_id macro.
If the makefile did not work for any reason, use [method 2](#manually-method-2).

#### **Manually (method 2)**

1. Firstly, inside the project's root folder, create a file called "Anchor.tolm" and paste in the following lines into the file:

```
[features]
seeds = false
[programs.localnet]
kratos = "KEYPAIR_ADDRESS"

[registry]
url = "https://anchor.projectserum.com"

[provider]
cluster = "localnet"
wallet = "KEYPAIR_PATH"

[scripts]
test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"
```

2. Fetch the path to your wallet's public key:

```bash
solana config get keypair
```

Replace KEYPAIR_PATH in Anchor.tolm with the output path string.

3. Run the following command inside the project's root folder to create a keypair:

```bash
solana-keygen new -o target/deploy/kratos-keypair.json
```

Replace KEYPAIR_ADDRESS in Anchor.tolm with the output pubkey. Go to programs/kratos/src/lib.rs and paste the same output where it says:

```
declare_id!("PASTE_IT_HERE")
```

4. Run this command to include the new program id in the binary:

```bash
anchor build
```

#### **Deployment**

1. Depending on where the program is being deployed, change the provider.cluster variable in Anchor.toml:

```
cluster = "devnet" / "testnet" / "mainnet-beta" / "localnet"
```

2. Set the solana config url to the same cluster as chosen above:

```bash
solana config set --url <cluster>
```

Meaning \<cluster> should be replaced with devnet / testnet / mainnet-beta / localhost.

3. Use [makefile](#makefile) to build, deploy and copy:

```bash
make deploy_and_copy
```

4. If any errors arise while deploying, there might be an insufficient amount of tokens. If the program is deployed on a [cluster](https://docs.solana.com/clusters) other than the mainnet, tokens can be freely acquired with the following command as they are not real:

```bash
solana airdrop 1
```

### **Solana config**

#### **Testnet**

Kratos has been deployed on the [testnet](https://docs.solana.com/clusters#testnet) for testing purposes. Deployment and transactions require tokens. Testnet tokens are free and can be obtained with the two following steps:

1. Make sure the Solana configuration is set to testnet by running the following command in the terminal:

```bash
solana config set --url testnet
```

2. Airdrop testnet 1 SOL token by running this command (repeat for more tokens):

```bash
solana airdrop 1
```

#### **Local test validator**

There might be a need for testing changes to Kratos locally. Here are the steps for running a local test validator.

1. Change the Solana configuration to localhost:

```bash
solana config set --url localhost
```

2. Change the provider.cluster variable in Anchor.toml:

```
cluster = "localnet"
```

3. Run a local test validator:

```bash
solana-test-validator
```

4. While running the test validator, open a seperate terminal and airdrop some tokens:

```bash
solana airdrop 1
```

5. Deploy the program to localnet if not already done. Use the [makefile](#makefile) to build, deploy and copy:

```bash
make deploy_and_copy
```

6. (Optional) To connect Iris to the local test validator, the address in Iris src/config/anchor.ts file needs to be changed to the localhost address. You can get the url address (RPC URL) by running the command:

```bash
solana config get
```

## **Makefile**

The makefile can be used to easily build, deploy and copy the project. Make sure to replace the copy target directory to the correct relative directory path to Iris if needed. Copy is necessarry for the backend (Iris) to be able to communicate with the blockchain (Kratos). Run the following command to build, deploy and copy:

```bash
make deploy_and_copy
```

## **Testing**

Make sure a (test) validator is not running on the machine used for testing. Then run this command to test the program:

```
anchor test
```
