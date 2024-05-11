export function formatToWon(price: number) {
  return price.toLocaleString("ko-KR");
}

export function formatToTimeAgo(date: string): string {
  // 하루를 ms로 변환
  const dayInMs = 1000 * 60 * 60 * 24;
  // 물건 올린 날
  const time = new Date(date).getTime();
  // 오늘 날짜
  const now = new Date().getTime();

  // js 기본 라이브러리
  const formatter = new Intl.RelativeTimeFormat("ko");

  // 올린 날에서 오늘 빼고 그걸 다시 나눠서 정수로 변환
  const diff = Math.round((time - now) / dayInMs);

  return formatter.format(diff, "days");
}
