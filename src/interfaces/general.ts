export interface ISimilarColorDTO {
  color_one: number;
  color_two: number;
  creatorId: number;
}
export interface IUserPrefDTO {
  lang: string;
  isCollectionVisible: boolean;
  isWantedVisible: boolean;
  allowMessages: boolean;
  prefName: string;
  prefId: string;
}
export interface IColorDTO {
  bl_name: string;
  tlg_name: string;
  bo_name: string;
  swatchId: number;
  hex: string;
  bl_id: number;
  tlg_id: number;
  bo_id: number;
  type: string;
  note: string;
  creatorId: number;
}
export interface color {
  id: number;
  bl_name: string;
  tlg_name: string;
  bo_name: string;
  swatchId: number;
  hex: string;
  bl_id: number;
  tlg_id: number;
  bo_id: number;
  type: string;
  note: string;
  createdAt: string;
  updatedAt: string;
}
export interface colorWSimilar {
  id: number;
  bl_name: string;
  tlg_name: string;
  bo_name: string;
  swatchId: number;
  hex: string;
  bl_id: number;
  tlg_id: number;
  bo_id: number;
  type: string;
  note: string;
  similar: color[];
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
  swatchId: number;
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
export interface similarColorDetailed {
  id: number;
  color1: color;
  color2: color;
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
export interface IElementID {
  number: number;
  id: number;
  creator: user;
  createdAt: string;
}
export interface IQPartDetails {
  part: IPartDTO;
  color: IColorDTO;
  qpart: IQPartDTOIncludeLess;
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
  elementIDs: IElementID[];
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
export interface ICollectionDTOGET {
  id: number;
  forTrade: boolean;
  forSale: boolean;
  availDuplicates: boolean;
  qpart: IQPartDTOIncludeLess;
  userId: number;
  quantity: number;
  condition: string;
  note: string;
}
export interface ICollectionDTO {
  forTrade: boolean;
  forSale: boolean;
  availDupes: boolean;
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
export interface IWantedDTOGET {
  id: number;
  type: string;
  qpart: IQPartDTOInclude;
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
  isPrimary: boolean;
  type: string;
  uploader: user;
  qpartId: number;
  approvalDate: string;
}

export interface ImageDTOExtended {
  id: number;
  fileName: string;
  type: string;
  isPrimary: boolean;
  uploader: user;
  qpart: IQPartDTOIncludeLess;
  approvalDate: string;
}

export interface ICreateScupltureDTO {
  name: string;
  brickSystem: string;
  location: string;
  yearMade: number;
  yearRetired: number;
  keywords: string;
  creatorId: number;
}
export interface ISimpleScupltureDTO {
  id: number;
  name: string;
  brickSystem: string;
  location: string;
  yearMade: number;
  yearRetired: number;
  keywords: string;
  creator: user;
}
export interface IScupltureDTO {
  id: number;
  name: string;
  brickSystem: string;
  location: string;
  yearMade: number;
  yearRetired: number;
  keywords: string;
  creator: user;
  qparts: IQPartDTOInclude[];
}
export interface IQPartDTOInclude {
  id: number;
  type: string;
  mold: IPartMoldDTO;
  color: color;
  creator: user;
  note: string;
  elementIDs: IElementID[];
  ratings: rating[];
  comments: ICommentDTO[];
  partStatuses: IPartStatusDTO[];
  images: ImageDTO[];

  approvalDate: string;
  createdAt: string;
}
export interface CustomStyles {
  [key: string]: string | number; // Allow any CSS property
}
export interface IQPartVerifcation {
  moldId: number;
  colorId: number;
}
export interface IArrayOfIDs {
  userId: number;
  ids: number[];
}
export interface IKnownRow {
  colorId: number;
  elementId: string;
}
export interface IMassKnown {
  userId: number;
  moldId: number;
  parts: IKnownRow[];
}
export interface IAPIResponseWithIds {
  code: number;
  message: string;
  ids: number[] | null;
}
export interface IQPartDTOIncludeLess {
  id: number;
  type: string;
  mold: IPartMoldDTO;
  color: color;
  creator: user;
  note: string;
  elementIDs: IElementID[];
  images: ImageDTO[];
  partStatuses: IPartStatusDTO[];
  createdAt: string;
  approvalDate: string;
}
export interface IQPartDTO {
  id: number;
  partId: number;
  colorId: number;
  creatorId: number;
  note: string;
  elementIDs: IElementID[];
  rarety: number;
}

export interface IElementIDCreationDTO {
  number: number;
  creatorId: number;
  qpartId: number;
}
export interface iQPartDTO {
  partId: number;
  moldId: number;
  colorId: number;
  type: string;
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
  blURL: string;
}

export interface IElementIDSearch {
  id: number;
  number: number;
  qpart: IQPartDTOIncludeLess;
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
  preferences: IUserPrefDTO;
  createdAt: string;
}
export interface IUserForgotPwd {
  name: string;
  email: string;
  password: string;
  q1: string;
  a1: string;
  q2: string;
  a2: string;
  q3: string;
  a3: string;
}
export interface passwordValidation {
  isLongEnough: boolean;
  containsNumber: boolean;
  containsLetter: boolean;
}
export interface IUserRecoveryDTO {
  name: string;
  email: string;
  password: string;
  securityQuestions: IRecoveryQuestionDTO[];
}
export interface IRecoveryQuestionDTO {
  id: number;
  answer: string;
  predefinedQuestion: IPredefinedSecQuestionRecDTO;
}
export interface IPredefinedSecQuestionRecDTO {
  id: number;
  question: string;
}
export interface IUserWSecQDTO {
  name: string;
  email: string;
  password: string;
  role: string;
  q1: ISecurityQuestionDTO;
  q2: ISecurityQuestionDTO;
  q3: ISecurityQuestionDTO;
}
export interface ISecurityQuestionDTO {
  questionId: number;
  answer: string;
}
export interface IPredefinedSecQuestionDTO {
  id: number;
  question: string;
}
export interface user {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface ISuspendUser {
  type: string;
  untilDate: string;
  reason: string;
  userId: number;
  adminId: number;
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
  blURL: string;
  creatorId: number;
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
export interface IGoalDTO {
  userId: number;
  partId: number;
  moldId: number;
  name: string;
  solid: boolean;
  trans: boolean;
  other: boolean;
  known: boolean;
}
export interface IGoalDTOExtended {
  id: number;
  userId: number;
  part: part;
  partMoldId: number;
  name: string;
  includeSolid: boolean;
  includeTrans: boolean;
  includeOther: boolean;
  includeKnown: boolean;
}
