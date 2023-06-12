export interface ISimilarColorDTO {
  color_one: number;
  color_two: number;
}
export interface IColorDTO {
  bl_name: string;
  tlg_name: string;
  bo_name: string;
  hex: string;
  bl_id: number;
  tlg_id: number;
  bo_id: number;
  type: string;
  note: string;
}
export interface color {
  id: number;
  bl_name: string;
  tlg_name: string;
  bo_name: string;
  hex: string;
  bl_id: number;
  tlg_id: number;
  bo_id: number;
  type: string;
  note: string;
  createdAt: string;
  updatedAt: string;
}

export interface IEditColor {
  bl_name: string;
  tlg_name: string;
  bo_name: string;
  hex: string;
  bl_id: number;
  tlg_id: number;
  type: string;
  note: string;
}
export interface similarColor {
  id: number;
  colorId1: number;
  colorId2: number;
  createdAt: string;
  updatedAt: string;
}
export interface IUploadImageDetails {
  part: part;
  qpartId: number;
  color: color;
}
export interface IQPartDTO {
  id: number;
  partId: number;
  colorId: number;
  creatorId: number;
  note: string;
  elementId: string;
  secondaryElementId: string;
  rarety: number;
}
export interface iQPartDTO {
  partId: number;
  colorId: number;
  elementId: string;
  secondaryElementId: string;
  creatorId: number;
  note: string;
}
export interface part {
  id: number;
  name: string;
  number: string;
  CatId: number;
  createdAt: string;
  updatedAt: string;
}
export interface IRatingDTO {
  rating: number;
  qpartId: number;
  creatorId: number;
}
export interface rating {
  id: number;
  rating: number;
  qpartId: number;
  creatorId: number;
  createdAt: string;
  updatedAt: string;
}
export interface IUserDTO {
  name: string;
  email: string;
  password: string;
  role: string;
}
export interface user {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface ILoginDTO {
  username: string;
  password: string;
}
export interface iPartDTO {
  name: string;
  number: string;
  secondaryNumber: string;
  CatId: number;
  note: string;
}

export interface category {
  id: number;
  name: string;
}

export interface IMessageDTO {
  recipientId: number;
  senderId: number;
  subject: string;
  body: string;
}
export interface message {
  id: number;
  subject: string;
  content: string;
  recipientId: number;
  senderId: number;
  createdAt: string;
  recipientUsername: string;
}
export interface IExtendedMessageDTO {
  id: number;
  recipientId: number;
  senderId: number;
  recipientName: string;
  senderName: string;
  subject: string;
  body: string;
  read: boolean;
  createdAt: string;
}
export interface IMailbox {
  inbox: IExtendedMessageDTO[];
  outbox: IExtendedMessageDTO[];
}
