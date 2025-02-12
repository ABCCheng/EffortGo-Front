export type DailyTop = {
  country: string;
  platform: string;
  title: string;
  image: string;
  type: string;
  updateTime: string;
  listData: DailyTopData[];
};

export type DailyTopData = {
  id: string;
  title: string;
  image: string
  hot: number;
  url: string;
  mobileUrl: string;
};
