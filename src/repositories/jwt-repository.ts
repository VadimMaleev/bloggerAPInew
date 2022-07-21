import {expiredTokensCollection, TokenType} from "./db";

export const jwtRepository = {
    async expireRefreshToken(refreshToken: TokenType) {
        await expiredTokensCollection.insertOne(refreshToken)
    },
    async findAllExpiredTokens(token: string): Promise<TokenType | null> {
       return await expiredTokensCollection.findOne({refreshToken: token});
    }
}