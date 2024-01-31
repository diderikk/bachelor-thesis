# Decentralized Identity - a mobile wallet and verification platform

**Thesis**: [https://hdl.handle.net/11250/3004162](https://hdl.handle.net/11250/3004162)

**Made by**:

- [RokasBliu](https://github.com/RokasBliu)
- [hamasl](https://github.com/hamasl)
- [diderikk](https://github.com/diderikk)


## Project Structure
* **[Aphrodite](https://gitlab.com/ntnu-idi/thesis/22_077/aphrodite.git)**: The mobile application of the Digital ID Wallet ecosystem. Users will only interact with this part of the project. The main features are storing Verifiable Credentials, and creating, displaying and verifying Verifiable Presentations.

* **[Athena](https://gitlab.com/ntnu-idi/thesis/22_077/athena.git)**: Mock issuer, used to display how issuers will implemented in the Digital ID Wallet ecosystem. Its main feature is allowing users to fetch their IDs as credentials.

* **[Iris](https://gitlab.com/ntnu-idi/thesis/22_077/iris.git)**: Backend part of the Digital ID Wallet application. Used as a connector that connects the blockchain with the mock issuer and frontend application.  

* **[Kratos](https://gitlab.com/ntnu-idi/thesis/22_077/kratos.git)**: The blockchain in the Digital ID Wallet's ecosystem. Used as a decentralized ledger for saving agreements between ID issuers and ID holders. Kratos is written using Anchor, a framework for the Solana blockchain. 
