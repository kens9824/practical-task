import { Exclude } from "class-transformer";
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ unique: true })
  userName: string;

  @Column()
  fullName: string;

  @Column()
  @Exclude()  
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ unique: true })
  phoneNumber: string;

  @Column({ type: "timestamp", nullable: true })
  last_updated: Date;

  @Column({ type: "timestamp", nullable: true })
  timestamp: Date;
}
