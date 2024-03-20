export interface UserPrefPayload {
  lang: string;
  isCollectionVisible: boolean;
  isWantedVisible: boolean;
  allowMessages: boolean;
  differentiateMaterialsInCollection: boolean;
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
    differentiateMaterialsInCollection: false,
    prefName: "bl",
    prefId: "tlg",
  },
};
