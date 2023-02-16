import { Types } from 'mongoose';

export interface ProductInterface {
  title: string;
  price: number;
  thumbnail: string;
  _id: Types.ObjectId;
}
