import { runQuery } from "../../dal/dal";

export async function isDBup() {
    try {
        await runQuery("select * from product;")
        return true;
    } catch (error) {
        return false;
    }
}