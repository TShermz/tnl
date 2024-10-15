import './Pages.css';

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import PageContent from "../components/UI/PageContent";
import FilterButtons from "../components/UI/FilterButtons";
import WeekSelector from "../components/UI/WeekSelector";

import { getWeeklyRecaps } from "../util/helpers/http";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import { sleeper_league_names } from "../util/constants";

export default function WeeklyRecapPage() {
  const selectedWeek = useSelector((state) => state.general.selectedWeek);
  const selectedSeason = useSelector((state) => state.general.selectedSeason);
  const selectedLeagueName = useSelector(
    (state) => state.general.selectedLeagueName
  );

  const currentRecapsWeek = selectedWeek - 1;

  const recaps = useQuery({
    queryKey: ["recaps"],
    queryFn: getWeeklyRecaps,
  });

  let content, selectedRecapHTML;

  function parseRecaps(recaps) {
    let rawRichTextField, renderedHtml;

    const selectedEntry = recaps.find(
      (entry) =>
        entry.fields.week === selectedWeek.toString() &&
        entry.fields.year === selectedSeason.toString() &&
        entry.fields.leagueName === selectedLeagueName
    );
    if (selectedEntry === undefined || selectedEntry === null) {
      document.getElementById("weeklyRecap").innerHTML =
        "No recap posted yet.";
    } else {
      // currentHTML = document.getElementById("weeklyRecap").innerHTML;
      rawRichTextField = selectedEntry.fields.body;
      renderedHtml = documentToHtmlString(rawRichTextField);
      document.getElementById("weeklyRecap").innerHTML = renderedHtml;
    }
  }

  if (recaps.isLoading) {
    content = (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  if (recaps.isError) {
    content = (
      <div>
        <ErrorBlock
          title="Failed to load message."
          message={error.info?.message || "Error when fetching data."}
        />
      </div>
    );
  }

  useEffect(() => {
    if (recaps.data) {
      parseRecaps(recaps.data);
    }
  }, [selectedWeek, selectedSeason, selectedLeagueName]);

  return (
    <PageContent>
      <WeekSelector />
      <FilterButtons
        className="homePageFilters"
        buttons={sleeper_league_names}
      />
      <div className="weeklyRecap" id="weeklyRecap">
        No recap posted yet.
      </div>

      {content}
    </PageContent>
  );
}
