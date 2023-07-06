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
export interface INotApporvedCounts {
  colors: number;
  categories: number;
  parts: number;
  partMolds: number;
  qelements: number;
  partStatuses: number;
  similarColors: number;
  images: number;
}
export interface IEditColor {
  bl_name: string;
  tlg_name: string;
  bo_name: string;
  hex: string;
  bl_id: number;
  bo_id: number;
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
export interface IAPIResponse {
  code: number;
  message: string;
}
export interface iIdOnly {
  id: number;
}
export interface IPartStatusDTO {
  id: number;
  status: string;
  date: string;
  location: string;
  note: string;
  qpartId: number;
  creatorId: number;
}
export interface IQPartDetails {
  part: IPartDTO;
  color: IColorDTO;
  qpart: iQPartDTO;
}
export interface IPartDTO {
  id: number;
  name: string;
  CatId: number;
  creatorId: number;
  note: string;
}
export interface IPartMoldDTO {
  id: number;
  number: string;
  parentPartId: number;
  creatorId: number;
  note: string;
  approvalDate: string;
  createdAt: string;
  parentPart: part;
}
export interface qpart {
  id: number;
  partId: number;
  colorId: number;
  creatorId: number;
  note: string;
  elementId: string;
  secondaryElementId: string;
  rarety: number;
  createdAt: string;
  updatedAt: string;
}

export interface IPartDTOIncludes {
  id: number;
  name: string;
  number: string;
  CatId: number;
  createdAt: string;
  updatedAt: string;
  approvalDate: string;
  molds: IPartMoldDTO[];
}
export interface ICommentDTO {
  id: number;
  creator: user;
  content: string;
  qpartId: number;
  createdAt: string;
}
export interface ICollectionDTO {
  forTrade: boolean;
  forSale: boolean;
  qpartId: number;
  userId: number;
  quantity: number;
  condition: string;
  note: string;
}
export interface IWantedDTO {
  type: string;
  qpartId: number;
  userId: number;
}

export interface ICommentCreationDTO {
  userId: number;
  content: string;
  qpartId: number;
}
export interface ImageDTO {
  id: number;
  fileName: string;
  type: string;
  userId: number;
  qpartId: number;
  approvalDate: string;
}

export interface ImageDTOExtended {
  id: number;
  fileName: string;
  type: string;
  uploader: user;
  qpart: IQPartDTOIncludeLess;
  approvalDate: string;
}
export interface IQPartDTOInclude {
  id: number;
  type: string;
  mold: IPartMoldDTO;
  color: color;
  creator: user;
  note: string;
  elementId: string;
  ratings: rating[];
  comments: ICommentDTO[];
  partStatuses: IPartStatusDTO[];
  images: ImageDTO[];
  createdAt: string;
}

export interface IQPartDTOIncludeLess {
  id: number;
  type: string;
  mold: IPartMoldDTO;
  color: color;
  creator: user;
  note: string;
  elementId: string;
  createdAt: string;
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
  moldId: number;
  colorId: number;
  type: string;
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
  approvalDate: string;
  molds: IPartMoldDTO[];
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
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;

  createdAt: string;
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
  CatId: number;
  note: string;
}
export interface IPartWithMoldDTO {
  id: number;
  name: string;
  number: string;
  CatId: number;
  partNote: string;
  moldNote: string;
}

export interface category {
  id: number;
  name: string;
  parts: part[];
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
