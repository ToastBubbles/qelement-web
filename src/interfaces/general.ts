import { ReactNode } from "react";

export interface ISimilarColorDTO {
  color_one: number;
  color_two: number;
  // creatorId: number;
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

export interface IDeletionDTO {
  itemToDeleteId: number;
  userId: number;
}

export interface IColorWUnk {
  unknown: boolean;
  color: color;
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

export interface IColorWCreator extends color {
  creator: user;
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
  sculptures: number;
  sculptureInventories: number;
  elementIDs: number;
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
export interface ISimilarColorDetailed {
  id: number;
  color1: color;
  color2: color;
  creator: user;
}

export interface ISimilarColorDetailedWithInversionId
  extends ISimilarColorDetailed {
  inversionId: number;
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

export interface IIdAndString extends iIdOnly {
  string: string;
}

export interface IIdStringBool extends IIdAndString {
  bool: boolean;
}

export interface IIdAndNumber extends iIdOnly {
  number: number;
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

export interface ITitle {
  title: string;
  cssClasses: string;
}

export interface ITitleDTO extends ITitle {
  id: number;
}
export interface ITitlesToAddToUsers {
  user: IUserDTO;
  title: ITitleDTO;
}
export interface IUserTitlePackedDTO {
  array: ITitlesToAddToUsers[];
}
export interface IPartStatusWQPart extends IPartStatusDTO {
  qpart: IQPartDTOInclude;
}
export interface IElementID {
  number: number;
  id: number;
  creator: user;
  createdAt: string;
}
export interface IElementIDWQPart extends IElementID {
  qpart: IQPartDTOInclude;
}
export interface IQPartDetails {
  part: IPartDTO;
  color: IColorDTO;
  qpart: IQPartDTOIncludeLess;
}
export interface IPartDTO {
  id: number;
  name: string;
  Category: ICategory;
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
  catId: number;
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
  edited: boolean;
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
  qpartId?: number;
  partId?: number;
  sculptureId?: number;
}
export interface ImageDTO {
  id: number;
  fileName: string;
  type: string;
  isPrimary: boolean;
  uploader: user;
  qpartId: number;
  sculptureId?: number;
  approvalDate: string;
}

export interface IImageEdits {
  id: number;
  type: string;
  isPrimary: boolean;
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
export interface IMoldStatus {
  moldId: number;
  status: string;
}
export interface IMoldStatusWUNK {
  partId: number;
  moldId: number;
  status: string;
  unknown: boolean;
}
export interface ICreateSculptureDTO {
  name: string;
  brickSystem: string;
  location: string;
  note: string;
  yearMade: number;
  yearRetired: number;
  keywords: string;
  creatorId: number;
}
export interface ISimpleSculptureDTO {
  id: number;
  name: string;
  brickSystem: string;
  location: string;
  yearMade: number;
  yearRetired: number;
  keywords: string;
  creator: user;
}

export interface ISculptureEdits {
  id: number;
  name: string;
  brickSystem: string;
  location: string;
  yearMade: number;
  yearRetired: number;
  note: string;
}

export interface ISculptureDTO {
  id: number;
  name: string;
  brickSystem: string;
  location: string;
  yearMade: number;
  yearRetired: number;
  keywords: string;
  note: string;
  creator: user;
  inventory: IQPartWSculptureInventory[];
  images: ImageDTO[];
  comments: ICommentDTO[];
  approvalDate: string;
}

export interface IRibbonOverride {
  content: string;
  bgColor: string;
  fgColor: string;
  fontSize: string;
}

export interface ISculptureInventory {
  parts: IQPartDTOInclude[];
  sculpture: ISculptureDTO;
}

interface IApprovalDateOnly {
  approvalDate: string | null;
}

export interface ISculpturePartIdPair {
  sculptureId: number;
  qpartId: number;
}

export interface IQPartWSculptureInventory extends IQPartDTOInclude {
  SculptureInventory: IApprovalDateOnly;
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
export interface IQPartDTO {
  id: number;
  partId: number;
  colorId: number;
  creatorId: number;
  isMoldUnknown: boolean;
  note: string;
  elementIDs: IElementID[];
  rarety: number;
}
export interface IQPartDTOIncludeLess {
  id: number;
  type: string;
  mold: IPartMoldDTO;
  isMoldUnknown: boolean;
  color: color;
  creator: user;
  note: string;
  elementIDs: IElementID[];
  images: ImageDTO[];
  partStatuses: IPartStatusDTO[];
  createdAt: string;
  approvalDate: string;
}

export interface IQPartDTOInclude extends IQPartDTOIncludeLess {
  ratings: rating[];
  comments: ICommentDTO[];
  sculptureInventories: ISculptureDTO[];
  UserFavorite?: IWantedDTOGET;
  UserInventory?: ICollectionDTOGET;
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
  isMoldUnknown: boolean;
  type: string;
  creatorId: number;
  note: string;
}
export interface part {
  id: number;
  name: string;
  // number: string;
  // catId: number;
  comments: ICommentDTO[];
  category: ICategory;
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
export interface user {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
}
export interface IUserCreationDTO {
  name: string;
  email: string;
  password: string;
}
export interface IFavorite extends IQPartDTOInclude {
  id: number;
  userId: number;
  type: string;
}
export interface IUserDTO extends IUserCreationDTO {
  id: number;
  role: string;
  preferences: IUserPrefDTO;
  profilePicture: ImageDTO | null;
  createdAt: string;
  titles: ITitleDTO[];
  selectedTitleId: number | null;
  favoriteQParts?: IQPartDTOInclude[];
  inventory?: IQPartDTOInclude[];
  favoriteColor?: color;
}

export interface INodeWithID {
  node: ReactNode;
  id: number;
}

export interface INodeWithIDAndCSS extends INodeWithID {
  cssClasses: string;
}

// export interface IUserWithPrefAndProfile extends IUserDTO {

// }
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
  favoriteColorId: number | null;
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

// export interface IUserW {
//   id: number;
//   name: string;
//   email: string;
//   password: string;
//   role: string;
// }

export interface ISuspendUser {
  type: string;
  untilDate: string;
  reason: string;
  userId: number;
  adminId: number;
}

export interface IChangeUserRole {
  userId: number;
  newRole: string;
  adminId: number;
}

export interface ILoginDTO {
  username: string;
  password: string;
}
export interface iPartDTO {
  name: string;
  number: string;
  catId: number;
  note: string;
}
export interface IPartWithMoldDTO {
  id: number;
  name: string;
  number: string;
  catId: number;
  partNote: string;
  moldNote: string;
  blURL: string;
  creatorId: number;
}

export interface ICategory {
  id: number;
  name: string;
}

export interface ICategoryWParts extends ICategory {
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
