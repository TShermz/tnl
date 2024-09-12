import PageContent from "../components/UI/PageContent";
import { getWeeklyPost } from "../util/http";

export default function WeeklyRecapPage() {
  getWeeklyPost("4ZF6KaZicK2yWOY0i2ILoh");

  return (
    <PageContent>
      <div className="weeklyRecap" id="weeklyRecap"></div>
    </PageContent>
  );
}
