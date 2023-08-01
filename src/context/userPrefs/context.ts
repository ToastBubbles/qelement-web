
export interface UserPreferencesStateType {
  userId: number;
  lang: string;
  isCollectionVisible: boolean;
  isWantedVisible: boolean;
  allowMessages: boolean;
  prefName: string;
  prefId: string;
}

export const userPrefrencesInitialState: UserPreferencesStateType = {
  userId: -1,
  lang: "en",
  isCollectionVisible: true,
  isWantedVisible: true,
  allowMessages: true,
  prefName: "bl",
  prefId: "tlg",
};
