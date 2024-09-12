import PageContent from "../components/UI/PageContent";
import { getWeeklyPost } from "../util/http";

export default function WeeklyRecapPage() {
  // const selectedWeek = useSelector((state) => state.general.selectedWeek);
  getWeeklyPost("4ZF6KaZicK2yWOY0i2ILoh");

  return (
    <PageContent>
      <h2>Week 1</h2>

      <div className="weeklyRecap" id="weeklyRecap"></div>
    </PageContent>
  );
}
