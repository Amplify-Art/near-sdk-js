import { PromiseOrValue } from "near-sdk-js/lib";
import { AccountId } from "near-sdk-js/lib/types";
import { TokenId } from "../token";

export interface NonFungibleTokenReceiver {
    nft_on_transfer(sender_id: AccountId, previous_owner_id: AccountId, token_id: TokenId, msg: String): PromiseOrValue<boolean>;
}
