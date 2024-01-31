# Iris

Backend part of the Digital ID Wallet application. Used as a connector that connects the blockchain with the mock issuer and frontend application.  
Made by:

- [RokasBliu](https://github.com/RokasBliu)
- [hamasl](https://github.com/hamasl)
- [diderikk](https://github.com/diderikk)

URL(http): []()

## Content

1. [Description](#description)
2. [Functionality](#functionality)
3. [API Documentation](#api-documentation)
4. [Installation manual](#installation-manual)

## Description

Iris is the backend part of the project, used as an intermediate ledger, allowing users/issuers to call the smart contract without a crypto wallet. It allows issuers to register themselves using both a UI or the API. Additionally, registered issuers can create revokable ID agreements. Agreements can also be fetches through Iris, allowing verifiers to validate them against received credentials.

## Functionality

### API Key

#### Generation

- Requires
  - Basic Authentication
    - Username - Defined as Environment Variable
    - Password - Defined as Environment Variable
- Generates a JWT token(key)
  - Expires in 3 hours

### Issuers

#### Registration

- Requires
  - API Key - Received from an admin
  - DID - Decentrialized Identifier
  - URL - URL to login page where users receive their ID
- Issuer can use either UI or API
- Registers the issuer to the blockchain via the smart contract

#### Fetching

- Returns a list of all registered issuers

### ID agreements

#### Generation

- Requires
  - Issuer DID
  - Document DID
  - Subject/Holder DID
  - Expiration date
- Adds an agreement to the blockchain via the smart contract

#### Invalidating

- Requires
  - Document DID
- Invalidates agreement

#### Fetching

- Requires
  - Document DID
- Fetches the agreement with given DID if registered

## API Documentation

### API Key

#### Generation

GET /api/v1/key (with Basic Auth)

Return:

```
{
	"key": "Example Key"
}
```

### Issuers

#### Registration

POST /api/v1/issuers

Params:

```
{
	"issuer": {
			"issuerName": "example",
			"url": "https://example.com",
			"did": "example DID"
	},
	"token": "Example API Key"
}
```

Return:

```
{
	"blockHash": "4YRJmLbsTe5cPqbAB1nJv8XgMh5U74ZKT4YwS2yEYKPvBP6vysmB3K942VC566QXuSFVcC3gitk6YjZV7RYRuZsr",
	"publicKey": "9p1W6tT3mYWZaeJXeJ4eRNsY828rgmhNQMW84b6oS1T5"
}
```

#### Fetching

GET /api/v1/issuers

Return:

```
[
	{
			"did": "did:key:example",
			"issuerName": "Example 1",
			"url": "https://example1.com/",
			"valid": true
	},
	{
			"did": "did:key:123",
			"issuerName": "Example 2",
			"url": "https://example2.com",
			"valid": false
	},
]
```

### ID agreements

#### Generation

POST /api/v1/ids

Params:

```
{
	"documentDid": "did:key:example",
	"issuerDid": "did:key:example",
	"holderDid": "did:key:example",
	"expirationDate": "2022-10-05T14:48:00.000Z"
}
```

Return:

```
{
	"blockHash": "4YRJmLbsTe5cPqbAB1nJv8XgMh5U74ZKT4YwS2yEYKPvBP6vysmB3K942VC566QXuSFVcC3gitk6YjZV7RYRuZsr",
	"publicKey": "9p1W6tT3mYWZaeJXeJ4eRNsY828rgmhNQMW84b6oS1T5"
}
```

#### Invalidating

DELETE /api/v1/ids/{documentDid}

Return:

```
{
	"blockHash": "4YRJmLbsTe5cPqbAB1nJv8XgMh5U74ZKT4YwS2yEYKPvBP6vysmB3K942VC566QXuSFVcC3gitk6YjZV7RYRuZsr",
	"publicKey": "9p1W6tT3mYWZaeJXeJ4eRNsY828rgmhNQMW84b6oS1T5"
}
```

#### Fetching

GET /api/v1/ids/{documentDid}

Return:

```
{
	"documentDid": "did:key:example",
	"issuerDid": "did:key:example",
	"holderDid": "did:key:example",
	"expirationDate": "2022-10-05T14:48:00.000Z",
	"valid": true
}
```

## Installation manual

1. [Install Solana](https://docs.solana.com/cli/install-solana-cli-tools)
2. If installed, run following commands in console:

```bash
solana config set --url testnet
solana airdrop 1
solana config get keypair
```

3. In the root of the repository, add an .env file containing:

```
DATABASE_URL="postgres://example:5432/example" # Valid Postgres Database URL
KEY_PAIR_PATH="/PATH/TO/SOLANA/WALLET/KEYPAIR" # Path received from "solana config get keypair"
REDIS_URL="redis://example" # Valid Redis Database URL
JWT_SECRET="..." # Securely generate long random string
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="test"
ANCHOR_ADDRESS="https://api.testnet.solana.com"
```

4. Install dependencies:

```bash
npm install
# or
yarn install
```

5. Application is now ready for running, run development server:

```bash
npm run dev
# or
yarn dev
```
