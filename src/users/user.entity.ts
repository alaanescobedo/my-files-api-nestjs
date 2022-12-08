
import { Exclude } from 'class-transformer';
import PublicFile from 'src/files/file-public.entity';
import Post from 'src/posts/post.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import Address from './address.entity';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({ unique: true })
  public email: string;

  @Column()
  public username: string;

  @Column()
  @Exclude()
  public password: string;

  @OneToOne(() => Address, { cascade: true, eager: true })
  @JoinColumn()
  public address: Address;

  @OneToMany(() => Post, (post: Post) => post.author)
  public posts: Post[];

  @OneToOne(() => PublicFile, { eager: true, nullable: true })
  @JoinColumn()
  public avatar?: PublicFile;

  @Column({ nullable: true })
  @Exclude()
  public refreshToken?: string;
}

export default User;