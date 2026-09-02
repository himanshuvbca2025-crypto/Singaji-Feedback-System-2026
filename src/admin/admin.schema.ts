import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'Admin' })
export class Admin {
  @Prop()
  username: string;

  @Prop()
  gmail: string;

  @Prop()
  password: string;
}

export type AdminDocument = Admin & Document;

export const AdminSchema = SchemaFactory.createForClass(Admin);