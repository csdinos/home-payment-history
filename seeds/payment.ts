import * as Knex from "knex";
import {paymentSeedData} from './data/payment'

export async function seed(knex: Knex): Promise<void> {
    await knex("payment").del();
    await knex("payment").insert(paymentSeedData);
};
