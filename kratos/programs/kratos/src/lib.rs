use anchor_lang::prelude::*;

// This should be the pubkey for the program (read Setup section in README.md)
// This string parameter needs to be the same as "kratos" key in Anchor.toml
declare_id!("EzZMUGqELf29dAgVuru6fMpZEvqR3dEJ142hPzMQuEXv");

#[program]
pub mod kratos {
    use super::*;
    // RPC request handler function with context of AddID structure
    pub fn add_id(ctx: Context<AddID>, document_did: String, issuer_did: String, holder_did: String, expiration_date: String) -> ProgramResult {
        let account = &mut ctx.accounts.contract_account;
        account.document_did = document_did;
        account.issuer_did = issuer_did;
        account.holder_did = holder_did;
        account.valid = true;
        account.expiration_date = expiration_date;
        Ok(())
    }
    // RPC request handler function with context of InvalidateID structure
    pub fn invalidate_id(ctx: Context<InvalidateID>) -> ProgramResult {
        let account = &mut ctx.accounts.contract_account;
        account.valid = false;
        Ok(())
    }
    // RPC request handler function with context of AddIssuer structure
    pub fn add_issuer(ctx: Context<AddIssuer>, did: String, issuer_name: String, url: String) -> ProgramResult {
        let account = &mut ctx.accounts.contract_account;
        account.did = did;
        account.issuer_name = issuer_name;
        account.url = url;
        account.valid = true;
        Ok(())
    }
}

// Instruction structure for creating an ID account
#[derive(Accounts)]
pub struct AddID<'info> {
    #[account(init, payer = wallet, space = 64 * 64)]
    pub contract_account: Account<'info, Document>,
    #[account(mut)]
    pub wallet: Signer<'info>,
    pub system_program: Program<'info, System>
}

// Instruction structure for invalidating an ID
#[derive(Accounts)]
pub struct InvalidateID<'info> {
    #[account(mut)]
    pub contract_account: Account<'info, Document>,
}

// Instruction structure for creating an issuer account
#[derive(Accounts)]
pub struct AddIssuer<'info> {
    #[account(init, payer = wallet, space = 64 * 64)]
    pub contract_account: Account<'info, Issuer>,
    #[account(mut)]
    pub wallet: Signer<'info>,
    pub system_program: Program<'info, System>
}

// Account structure for storing data about ID agreements
#[account]
pub struct Document {
    pub document_did: String,
    pub issuer_did: String,
    pub holder_did: String,
    pub valid: bool,
    pub expiration_date: String,
}

// Account structure for storing data about issuer agreements
#[account]
pub struct Issuer {
    pub did: String,
    pub issuer_name: String,
    pub url: String,
    pub valid: bool,
}
