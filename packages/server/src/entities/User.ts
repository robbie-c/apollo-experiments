import * as bcrypt from "bcrypt";
import { IsEmail } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { PASSWORD_SALT_ROUNDS } from "../config/crypto";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column()
  public givenName: string;

  @Column()
  public familyName: string;

  @Column({ unique: true })
  @IsEmail()
  public email: string;

  @Column({ nullable: true })
  private password?: string;

  public async setPasswordHashFromPlainText(plainText: string) {
    this.password = await bcrypt.hash(plainText, PASSWORD_SALT_ROUNDS);
  }

  public async comparePassword(plainText: string) {
    if (!this.password) {
      return false;
    }
    return bcrypt.compare(plainText, this.password);
  }
}
