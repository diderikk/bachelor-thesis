# Athena

Mock issuer, used to display how issuers will implemented in the Digital ID Wallet ecosystem. Its main feature is allowing users to fetch their IDs as credentials.

Made by:

- [RokasBliu](https://github.com/RokasBliu)
- [hamasl](https://github.com/hamasl)
- [diderikk](https://github.com/diderikk)

URL(http): []()

## Content

1. [Description](#description)
2. [Functionality](#functionality)
3. [Installation manual](#installation-manual)

## Description

Athena is an mock issuer, used to display how issuers will be implemented in the Digital ID Wallet ecosystem. Its main feature is allowing users to fetch their IDs as Verifiable Credentials by authenticating using their personal ID and password. Athena's implementation also consists of a UI, that allow "admins" to manage users, like register new users, and revoking IDs.

## Functionality

### Users

#### Register

- Requires
  - Personal ID
  - Forename
  - Surname
  - Password
  - Expiration Date
- Registers user to the issuers storage

#### Remove

- Requires
  - List of unique IDs
- Removes all users given by IDs and calls Iris to revoke ID agreements

#### Fetch

- Requires
  - One user - ID
  - All users - None
- Fetches user/users

#### Edit

- Requires
  - ID
  - Personal ID
  - Forename
  - Surname
  - Password (optional)
  - Expiration Date
- Edits user and stores it

### ID

#### Fetch

- Requires
  - Authentication
    - Personal ID
    - Password
- Creates ID agreement
  - Issuer sends a REST call to the backend server
  - Awaits confirmation of the ID agreement being stored in the smart contract
- Converts ID to a Verifiable Credential
- Initializes a WebSocket server
  - Client/user can connect to the server from the mobile application
  - The server sends the credential through the WebSocket connection

## API Documentation

### Users

#### Register

POST /api/v1/users

Params:

```
{
	"personalId": "12345678901",
	"forename": "example forename",
	"surename": "example surname",
	"password": "Password123456",
	"expirationDate": "2022-10-05T14:48:00.000Z"
}
```

Return:  
Status 201

```
{
	"id": 1,
	"personalId": "12345678901",
	"forename": "example forename",
	"surname": "example surname",
	"expirationDate": "2022-10-05T14:48:00.000Z"
}
```

#### Remove

DELETE /api/v1/users

Params:

```
{
	"ids": [
		"1",
		"4"
	],
}
```

Return:  
Status 204

#### Fetch

GET /api/v1/users

Return:  
Status 200

```
{
	[
		{
			"id": 1,
			"personalId": "12345678901",
			"forename": "example forename1",
			"surname": "example surname1",
			"expirationDate": "2022-10-05T14:48:00.000Z"
		},
		{
			"id": 2,
			"personalId": "12345678902",
			"forename": "example forename2",
			"surname": "example surname2",
			"expirationDate": "2022-10-05T14:48:00.000Z"
		},
	]
}
```

GET api/v1/users/{id}

Return:  
Status 200

```
{
	"id": 1,
	"personalId": "12345678901",
	"forename": "example forename1",
	"surname": "example surname1",
	"expirationDate": "2022-10-05T14:48:00.000Z"
}
```

#### Edit

PUT api/v1/users/{id}

Params:

```
{
	"personalId": "12345678902",
	"forename": "example forename",
	"surename": "example surname",
	"password": "Password123456",
	"expirationDate": "2022-10-05T14:48:00.000Z"
}
```

Return:  
Status 200

```
{
	"id": 1,
	"personalId": "12345678902",
	"forename": "example forename",
	"surname": "example surname",
	"expirationDate": "2022-10-05T14:48:00.000Z"
}
```

### ID

#### Fetch

POST /api/v1/login/?did=did:key:example123

Params:

```
{
	"personalId": "12345678901",
	"password": "Password123456",
}
```

Return:  
Status 201

```
{
	"issuer":{
		"id":"did:key:z6MkjheWYC3AdV8UvFHcqWF3ZNvxbJRMAb7HgJTxHqQUyRhN",
		"name":"Athena"
	},
	"credentialSubject":{
		"document":{
			"personalId":"12345678901",
			"forename":"example",
			"surname":"example",
			"expirationDate":"2097-04-30T11:20:24+00:00"
		},
		"id":"did:key:example123"
	},
	"id":"did:key:z6MkgvafhihXiKASgp5vsU2heudpw568yUTUVM6YoKKiZkoA","type":["VerifiableCredential"],
	"@context":["https://www.w3.org/2018/credentials/v1"],"issuanceDate":"2022-04-26T12:26:28.000Z",
	"proof":{
		"type":"JwtProof2020",
		"jwt":"eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIl0sImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImRvY3VtZW50Ijp7InBlcnNvbmFsSWQiOiIxMTExMTExMTExMSIsImZvcmVuYW1lIjoiVGVzdFVzZXIiLCJzdXJuYW1lIjoiVGVzdFVzZXIiLCJleHBpcmF0aW9uRGF0ZSI6IjIwOTctMDQtMzBUMTE6MjA6MjQrMDA6MDAifX19LCJpc3N1ZXIiOnsibmFtZSI6IkF0aGVuYSJ9LCJzdWIiOiJkaWQ6a2V5OmV4YW1wbGUxMjMiLCJqdGkiOiJkaWQ6a2V5Ono2TWtndmFmaGloWGlLQVNncDV2c1UyaGV1ZHB3NTY4eVVUVVZNNllvS0tpWmtvQSIsIm5iZiI6MTY1MDk3NTk4OCwiaXNzIjoiZGlkOmtleTp6Nk1ramhlV1lDM0FkVjhVdkZIY3FXRjNaTnZ4YkpSTUFiN0hnSlR4SHFRVXlSaE4ifQ.XWvd67OqOidcYT18nmYx9ZdECGKNiuzBS9KQ6OA-2wB0VG-LDC924-UoA2_EFpuI5saZ5bCG4S96HfjMBxWRDg"
	}
}
```

## Supabase Schema

Supabase has not been configured with row level security (RLS). This decision was taken due to Athena being a mock issuer, and should therefore be as simple as possible. If row level security is enabled, the application will probably not work. Keep in mind that without row level security anyone with the Supabase URL and anon key can complete any transactions to the database. Also, this not the actual sql queries used for creating the tables. However, when using the supabase table editor enter the schema details to create the correct database model.

### IssuerDID

```
{
	did: varchar (PK)
	provider: varchar (NULLABLE)
	alias: varchar (UNIQUE) (NULLABLE)
	controllerKeyId: varchar (NULLABLE)
	keys: jsonb[] (NULLABLE)
	services: jsonb[] (NULLABLE)
}
```

### IssuerDIDKeys

```
{
	kid: varchar (PK)
	publicKey: jsonb (NULLABLE)
	privateKey: jsonb (NULLABLE)
}
```

### Users

```
{
	id: int8 (PK)
	personalId: varchar (UNIQUE)
	hash: varchar
	salt: varchar
	forename: varchar
	surname: varchar
	expirationDate: timestampz
	documentDIDs: varchar[]
}
```

## Installation manual

1. In the root of the repository, add an .env.local file containing:

```
DEV_PROTOCOL=http # Protocol used when fetching data
DEV_SERVER_URL=<DEV_SERVER_URL> # Athena URL. Make sure that the server starts on this domain and port. Cannot be the same as Iris URL.
DEV_SUPABASE_URL="https://example.supabase.co" # Valid supabase URL
DEV_SUPABASE_ANON_KEY="example key" # Valid supabase key
DEV_SUPABASE_USER_TABLE="Users" # User table name
DEV_BACKEND_URL=<DEV_BACKEND_URL> # Iris URL. Cannot be the same as Athena URL
# This can be a lot less then the PROD version since no attacks are expected.
DEV_PBKDF2_ITERATIONS=2048 # The amount of times th pbkdf2 algortihm runs sha512
DEV_PBKDF2_KEY_SIZE=64 # The key size used in the pbkdf2 algorithm


IS_DEV=true # Must be exactly "true" for dev mode to be activated. Else prod is used.


# IMPORTANT that this is https to ensure encrypted communication
PROD_PROTOCOL=https # Protocol used when fetching data
PROD_SERVER_URL=<PROD_SERVER_URL> # Athena URL. Make sure that the server starts on this domain and port. Cannot be the same as Iris URL
PROD_SUPABASE_URL="https://example.supabase.co" # Valid supabase URL
PROD_SUPABASE_ANON_KEY="example key" # Valid supabase key
PROD_SUPABASE_USER_TABLE="Users" # User table name
PROD_BACKEND_URL=<PROD_BACKEND_URL> # Iris URL. Cannot be the same as Athena URL

# VERY important to run "openssl speed" and view how many sha512 iterations can be done in 3s for the selected key size and choose the prod iterations thereafter.
# Aim for it to take enough time to hinder mass trial and error, but also not long enough time to disturb the user.
# E.g., 0.5s which would mean dividing the iterations by 3s/0.5s = 6.
# Make sure to keep the iteration count and key size hidden to make it harder for potential threat actors to crack passwords.
PROD_PBKDF2_ITERATIONS=376890 # The amount of times th pbkdf2 algortihm runs sha512
PROD_PBKDF2_KEY_SIZE=1024 # The key size used in the pbkdf2 algorithm
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Application is now ready for running, run development server:

```bash
npm run dev
# or
yarn dev
```
