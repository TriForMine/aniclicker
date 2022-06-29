import * as edgedb from "edgedb";
import builder from "../../dbschema/edgeql-js";

const db = edgedb.createClient();

export { db, builder };
