# Aphrodite

The mobile application of the Digital ID Wallet project.

Made by:

- [RokasBliu](https://github.com/RokasBliu)
- [hamasl](https://github.com/hamasl)
- [diderikk](https://github.com/diderikk)

## Content

1. [Description](#description)
2. [Functionality](#functionality)
3. [Future work](#future-work)
4. [Installation manual](#installation-manual)

## Description

The mobile application of the Digital ID Wallet ecosystem. Users will only interact with this part of the project. The main features are storing Verifiable Credentials, and creating, displaying and verifying Verifiable Presentations.

## Functionality

### Authentication

#### Sign Up

- Requires
  - Select PIN Code
  - Confirm PIN Code
- Initializes Wallet
  - Creates a empty list of Verifiable Credentials
  - Creates a holder DID for the wallet
- Navigates user to Home page

#### Sign In

- Requires
  - PIN Code
- Navigates user to Home page
  - Fetches all Verifiable Credentials

### Verifiable Credential

#### Fetch

- Requires
  - Press "+" button in Home page
  - Card name
  - Card color
  - Credential issuer/provider
- Navigates to issuer URL for fetching Verifiable Credential
  - Requires authentication
- Adds Verifiable Credential to wallet
- Navigates to Home page

#### Delete

- Requires
  - Press options icon on a card and select "Delete"
  - Confirm delete
- Calls backend for deleting Agreement in smart contract
- Deletes Verifiable Credential stored on device

#### Update

- Requires
  - Press options icon on a card and select "Edit"
  - Card name
  - Card color
- Updates card name and color displayed on card

### Verifiable Presentation

#### Create from single Verifiable Credential

- Requires
  - Press card
  - [Select claims](#future-work)
  - Press "Share selected"
- Creates a Verifiable Presentation from the selected Verifiable Credential
- Displays it as a QR Code

#### Create from multiple Verifiable Credentials

- Requires
  - Navigate to "Share data" page
  - [Select claims from different Verifiable Credentials](#future-work)
  - Press "Share"
- Creates a Verifiable Presentation from selected the Verifiable Credentials
- Displays it as a QR Code

#### Store

- Requires
  - Navigate to "Share data" page
  - [Select claims from different Verifiable Credentials](#future-work)
  - Press "Save"
- Navigates to "Save Preset" page
  - Requires
    - Card name
    - Card color
- Stores a Verifiable Presentation from selected the Verifiable Credentials

### Verify

- Requires
  - Navigate to "Verify" page
  - Scan a valid QR code
- Validates QR-code content and extracts data
- Calls backend to fetch ID agreement stored on the blockchain
- Validates if data extracted and agreement corresponds and if agreement is valid and not expired.
- Modal pops up displaying verification status

## Future work

- **Selective Disclosure.** UI has been implemented, allowing users to select what claims they want in their Verifiable Presentation. However, the logic has not yet been implemented, rendering the UI useless. Selecting claims makes no difference, the Verifiable Presentation will always be created from the entire Verifiable Credentials. The main reason is Veramo (the Verifiable Credential framework used) has not deployed a full implementation.

- **PIN lock features.** Features like sharing a Verifiable Presentation should be protected by a PIN code. This would prevent a thief that has stolen a phone with the application open from sharing credentials. Can be solved using the PIN component when a user presses "Share".

- **API Verification.** This feature will allow service provider that need ID verification to use the application. Sercice provider allow their users an option to select the application to prove their identity. This will open the app and the user selects the necessary Verifiable Credentials for the identification. The application sends the credentials to the service provider, and the user has been verified.

- **Refresh Verifiable Credential.** Fetches a new instance of the Verifiabel Credential from the issuer/provider if available.

## Installation manual

Currently only Android works, as a bug was discovered, that causes `yarn ios` to crash (to test on ios rember to run `pod install` in /ios folder). Due to the projects's time constraint, and that only one team member can run iOS (as MacOs developer platform is required), aborting the issue for now was decided.

1. [Set up a development environment](https://reactnative.dev/docs/environment-setup)
2. In the root of the repository, add an .env file containing:

```
RESET_APPLICATION_ON_STARTUP=false # Must be exactly "true" for application to reset on startup. Else no reset is done.
IS_DEV=true # Must be exactly "true" for dev mode to be activated. Else prod is used. Also, decides websocket url in EmbeddedWeb.tsx.
DEV_BACKEND_URL=<DEV_IRIS_URL> # Iris URL. <DEV_IRIS_URL> is the mobile version of localhost.
DEV_PBKDF2_ITERATIONS=2048 # The amount of times the pbkdf2 algortihm runs sha512
DEV_PBKDF2_KEY_SIZE=64 # The key size used in the pbkdf2 algorithm


PROD_BACKEND_URL=<PROD_IRIS_URL> # Iris URL
# VERY important to run "openssl speed" (keep in mind it has to be run on a mobile device, sine this is a mobile app) and view how many sha512 iterations can be done in 3s for the selected key size and choose the prod iterations thereafter.
# Aim for it to take enough time to hinder mass trial and error, but also not long enough time to disturb the user.
# E.g., 0.5s which would mean dividing the iterations by 3s/0.5s = 6.
# Make sure to keep the iteration count and key size hidden to make it harder for potential threat actors to crack passwords.
# If the iterations or key size change remember to reset the device as the hash for the same password will not equal the previously saved hash.
# The mobile device may crash on log in if the iteration count is too high. In that case lower it, till it does not crash anymore.
PROD_PBKDF2_ITERATIONS=3767 # The amount of times the pbkdf2 algortihm runs sha512
PROD_PBKDF2_KEY_SIZE=1024 # The key size used in the pbkdf2 algorithm


# These are used as indexes for storing the user details and the list containing all IDs stored in the RESET_APPLICATION_ON_STARTUP
# The names do not matter to much but cannot be the same
# IF VALUES ARE CHANGED REMEMBER THAT ALL SAVED DATA WILL BE LOST AS THEY WILL BE LOCATED AT THE OLD VALUES
# THIS CAN BE CONSIDERED THE SAME AS A DEVICE RESET
# The nickname of an ID card cannot be the same as these two
SECURE_STORE_USER_KEY=LOCALHOST_USER
SECURE_STORE_ID_CARD_LIST_KEY=LOCALHOST_ID_CARD_LIST
```

3. Install dependencies:

```bash
npm install
# or
yarn install
```

4. Application is now ready for running, run server:

```bash
npm run start
# or
yarn start
```

5. Connect your development environment to the server

```bash
npm run android
# or
yarn android
```
