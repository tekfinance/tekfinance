import bs58 from "bs58";
import BN from "bn.js";
import { safeBN, unsafeBN } from "@solocker/safe-bn";
import {
  createAssociatedTokenAccountIdempotentInstruction,
  createTransferCheckedInstruction,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";

import type { Secret } from "../../core";
import { isNative } from "../../utils/web3";
import { feePercentage, marketingWallet } from "../..";

type CreateTransferInstructionArgs = {
  account: string;
  amount: number;
  decimals: number;
  mint: string;
  connection?: Connection;
};

export class SolanaWallet {
  readonly keypair: Keypair;

  constructor(key: number[]);
  constructor(secret: Secret, hash: string);
  constructor(...args: any[]) {
    if (args.length > 1) {
      const [secret, hash] = args as [Secret, string];
      const secretKey = secret.decrypt<{ secretKey: string }>(hash).secretKey;
      this.keypair = Keypair.fromSecretKey(bs58.decode(secretKey));
    } else {
      const [key] = args;
      this.keypair = Keypair.fromSecretKey(Uint8Array.from(key));
    }
  }

  get publicKey() {
    return this.keypair.publicKey;
  }

  async createTransferInstructions(
    connection: Connection,
    ...params: CreateTransferInstructionArgs[]
  ) {
    const instructions = [];
    const accountInfos = await connection.getMultipleAccountsInfo(
      params.map(({ account }) => new PublicKey(account))
    );
    const minimumRentBalance =
      await connection.getMinimumBalanceForRentExemption(0);
    const paramsWithTokenBalance = params.map((param, index) => {
      const accountInfo = accountInfos[index];
      return Object.assign(param, { lamports: accountInfo?.lamports ?? 0 });
    });

    const oneOfInstructions: {
      pre: Record<string, TransactionInstruction>;
      post: Record<string, TransactionInstruction>;
    } = { pre: {}, post: {} };

    for (const {
      account,
      amount,
      mint,
      decimals,
      lamports,
    } of paramsWithTokenBalance) {
      const native = isNative(mint);

      const initialAmount = unsafeBN(
        safeBN(Number(amount), Number(decimals)).mul(
          new BN(Math.pow(10, decimals))
        ),
        Number(decimals)
      );

      const fee = initialAmount.mul(new BN(feePercentage)).div(new BN(100));
      const safeAmount = initialAmount.sub(fee);

      if (native) {
        const rent = minimumRentBalance - lamports;
        let safeRent = new BN(0);

        if (rent > 0) safeRent = new BN(rent);

        instructions.push(
          SystemProgram.transfer({
            toPubkey: new PublicKey(account),
            fromPubkey: this.publicKey,
            lamports: BigInt(safeAmount.add(safeRent).toString()),
          }),
          SystemProgram.transfer({
            toPubkey: marketingWallet,
            fromPubkey: this.publicKey,
            lamports: BigInt(fee.toString()),
          })
        );
      } else {
        const fromAta = getAssociatedTokenAddressSync(
          new PublicKey(mint),
          this.publicKey
        );
        const toAta = getAssociatedTokenAddressSync(
          new PublicKey(mint),
          new PublicKey(account)
        );
        const marketAta = getAssociatedTokenAddressSync(
          new PublicKey(mint),
          marketingWallet
        );

        let key = mint + marketAta.toBase58();
        let hasIntruction = key in oneOfInstructions.pre;

        if (!hasIntruction)
          oneOfInstructions.pre[key] =
            createAssociatedTokenAccountIdempotentInstruction(
              this.publicKey,
              marketAta,
              marketingWallet,
              new PublicKey(mint)
            );
        key = mint + toAta.toBase58();
        hasIntruction = key in oneOfInstructions.pre;

        if (!hasIntruction)
          oneOfInstructions.pre[key] =
            createAssociatedTokenAccountIdempotentInstruction(
              this.publicKey,
              toAta,
              new PublicKey(account),
              new PublicKey(mint)
            );

        instructions.push(
          createTransferCheckedInstruction(
            fromAta,
            new PublicKey(mint),
            toAta,
            this.publicKey,
            BigInt(safeAmount.toString()),
            decimals
          ),
          createTransferCheckedInstruction(
            fromAta,
            new PublicKey(mint),
            marketAta,
            this.publicKey,
            BigInt(fee.toString()),
            decimals
          )
        );
      }
    }

    return Object.values(oneOfInstructions.pre)
      .concat(instructions)
      .concat(Object.values(oneOfInstructions.post));
  }

  async createVersionedTransaction(
    connection: Connection,
    instructions: TransactionInstruction[]
  ) {
    const recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    const message = new TransactionMessage({
      instructions,
      recentBlockhash,
      payerKey: this.publicKey,
    }).compileToV0Message();

    return new VersionedTransaction(message);
  }

  async sendVersionedTransaction(
    connection: Connection,
    transaction: VersionedTransaction
  ) {
    transaction.sign([this.keypair]);
    return connection.sendTransaction(transaction);
  }

  sendAndConfirmTransaction(connection: Connection, transaction: Transaction) {
    return sendAndConfirmTransaction(connection, transaction, [this.keypair]);
  }
}
