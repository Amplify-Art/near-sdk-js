import { AccountId } from 'near-sdk-js/lib/types'
import { Token, TokenId } from '../token'
import { Option } from 'near-sdk-js/lib/utils'

export interface NonFungibleTokenCore {
  nft_transfer(receiver_id: AccountId, token_id: TokenId, approval_id: Option<bigint>, memo: Option<string>)
  nft_transfer_call(
    receiver_id: AccountId,
    token_id: TokenId,
    approval_id: Option<bigint>,
    memo: Option<string>,
    msg: string
  )
  nft_token(token_id: TokenId): Option<Token>
}
