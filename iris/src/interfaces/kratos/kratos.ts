export type Kratos = {
  "version": "0.1.0",
  "name": "kratos",
  "instructions": [
    {
      "name": "addId",
      "accounts": [
        {
          "name": "contractAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "wallet",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "documentDid",
          "type": "string"
        },
        {
          "name": "issuerDid",
          "type": "string"
        },
        {
          "name": "holderDid",
          "type": "string"
        },
        {
          "name": "expirationDate",
          "type": "string"
        }
      ]
    },
    {
      "name": "invalidateId",
      "accounts": [
        {
          "name": "contractAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "addIssuer",
      "accounts": [
        {
          "name": "contractAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "wallet",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "did",
          "type": "string"
        },
        {
          "name": "issuerName",
          "type": "string"
        },
        {
          "name": "url",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "document",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "documentDid",
            "type": "string"
          },
          {
            "name": "issuerDid",
            "type": "string"
          },
          {
            "name": "holderDid",
            "type": "string"
          },
          {
            "name": "valid",
            "type": "bool"
          },
          {
            "name": "expirationDate",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "issuer",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "did",
            "type": "string"
          },
          {
            "name": "issuerName",
            "type": "string"
          },
          {
            "name": "url",
            "type": "string"
          },
          {
            "name": "valid",
            "type": "bool"
          }
        ]
      }
    }
  ]
};

export const IDL: Kratos = {
  "version": "0.1.0",
  "name": "kratos",
  "instructions": [
    {
      "name": "addId",
      "accounts": [
        {
          "name": "contractAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "wallet",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "documentDid",
          "type": "string"
        },
        {
          "name": "issuerDid",
          "type": "string"
        },
        {
          "name": "holderDid",
          "type": "string"
        },
        {
          "name": "expirationDate",
          "type": "string"
        }
      ]
    },
    {
      "name": "invalidateId",
      "accounts": [
        {
          "name": "contractAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "addIssuer",
      "accounts": [
        {
          "name": "contractAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "wallet",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "did",
          "type": "string"
        },
        {
          "name": "issuerName",
          "type": "string"
        },
        {
          "name": "url",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "document",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "documentDid",
            "type": "string"
          },
          {
            "name": "issuerDid",
            "type": "string"
          },
          {
            "name": "holderDid",
            "type": "string"
          },
          {
            "name": "valid",
            "type": "bool"
          },
          {
            "name": "expirationDate",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "issuer",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "did",
            "type": "string"
          },
          {
            "name": "issuerName",
            "type": "string"
          },
          {
            "name": "url",
            "type": "string"
          },
          {
            "name": "valid",
            "type": "bool"
          }
        ]
      }
    }
  ]
};
