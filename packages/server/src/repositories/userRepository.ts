import * as bcrypt from "bcrypt";
import * as createHttpError from "http-errors";
import { Equal, getManager } from "typeorm";
import { config } from "../config";
import { User } from "../entities/user";

export const getUserById = async (id: string) => {
  const userRepository = getManager().getRepository(User);
  return await userRepository.findOne({
    id: Equal(id)
  });
};

export const getUserByEmail = async (email: string) => {
  const userRepository = getManager().getRepository(User);
  return await userRepository.findOne({
    email: Equal(email)
  });
};

export const insertUser = async (user: User) => {
  const userRepository = getManager().getRepository(User);
  return await userRepository.insert(user);
};

interface GetOrInsertResult<T> {
  wasInserted: boolean;
  value: T;
}

export const getOrInsertUserByEmail = async (
  email: string,
  passwordPlainText?: string
): Promise<GetOrInsertResult<User>> => {
  let passwordHash: string | undefined;
  if (passwordPlainText) {
    passwordHash = await bcrypt.hash(passwordPlainText, config.saltRounds);
  }

  const userRepository = getManager().getRepository(User);
  // Gotta love using an ORM....
  // This is heavily inspired by https://stackoverflow.com/questions/34708509/how-to-use-returning-with-on-conflict-in-postgresql/42217872#42217872
  // We do an INSERT that does nothing on conflict, but unfortunately the
  // RETURNING will only return values that were inserted or updated. We could
  // force a dummy update but this has performance problems. Instead do a
  // SELECT based on the input data, and UNION the INSERT and SELECT
  const queryResponse = await userRepository.query(
    `
WITH input_rows(email, password) AS (
   VALUES
      ($1, $2)
   )
, ins AS (
   INSERT INTO "user" (email, password) 
   SELECT * FROM input_rows
   ON CONFLICT (email) DO NOTHING
   RETURNING *            
   )
SELECT 'i' AS source, ins.*                   
FROM   ins
UNION  ALL
SELECT 's' AS source, u.*               
FROM input_rows
JOIN "user" u USING (email);
`,
    [email, passwordHash || null]
  );

  const rawUser = queryResponse && queryResponse[0];
  if (!rawUser) {
    throw createHttpError(
      500,
      "No user in response from get or insert from db"
    );
  }

  const user = new User();
  user.id = rawUser.id;
  user.email = rawUser.email;
  return { wasInserted: rawUser.source === "i", value: user };
};
