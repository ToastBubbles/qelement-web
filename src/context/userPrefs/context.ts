export interface UserPrefPayload {
  lang: string;
  isCollectionVisible: boolean;
  isWantedVisible: boolean;
  allowMessages: boolean;
  prefName: string;
  prefId: string;
}
export interface UserPrefStateType {
  payload: UserPrefPayload;
}
export const userPrefrencesInitialState: UserPrefStateType = {
  payload: {
    lang: "en",
    isCollectionVisible: true,
    isWantedVisible: true,
    allowMessages: true,
    prefName: "bl",
    prefId: "tlg",
  },
};
