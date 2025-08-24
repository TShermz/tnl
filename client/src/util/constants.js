export const sleeper_league_ids = {
  2024: [
    { name: "Lint Lickers", id: "1126967089417269248" },
    { name: "Knuckleheads", id: "1128412178291253248" },
    { name: "Jabronis", id: "1128412463579484160" },
  ],
  2025: [
    { name: "Golden Goats", id: "1260829247371489280" },
    { name: "Silver Sharks", id: "1260830488965165056" },
    { name: "Bronze Bears", id: "1260830810236260352" },
  ],
};

export const sleeper_league_names = {
  2024: ["Jabronis", "Knuckleheads", "Lint Lickers"],
  2025: ["Golden Goats", "Silver Sharks", "Bronze Bears"]
};

export const weekly_awards = [
  "Highest Score",
  "Lowest Score",
  "Biggest Beatdown",
];

export const standingsTableHeaders = [
  // {
  //   id: "rank",
  //   numeric: false,
  //   disablePadding: false,
  //   label: "Rank",
  // },
  {
    id: "leagueName",
    numeric: false,
    disablePadding: true,
    sortable: false,
    label: "League",
  },
  {
    id: "teamName",
    numeric: false,
    disablePadding: false,
    sortable: false,
    label: "Team",
  },
  {
    id: "powerScore",
    numeric: false,
    disablePadding: true,
    sortable: true,
    label: "Power Score",
  },
  {
    id: "wins",
    numeric: false,
    disablePadding: false,
    sortable: true,
    label: "Wins",
  },
  {
    id: "losses",
    numeric: false,
    disablePadding: true,
    sortable: true,
    label: "Losses",
  },
  {
    id: "fpts",
    numeric: false,
    disablePadding: false,
    sortable: true,
    label: "Points For",
  },
  {
    id: "ppts",
    numeric: false,
    disablePadding: false,
    sortable: true,
    label: "Potential Points For",
  },
  {
    id: "accuracy",
    numeric: false,
    disablePadding: false,
    sortable: true,
    label: "Start Accuracy",
  },
  {
    id: "fpts_against",
    numeric: false,
    disablePadding: false,
    sortable: true,
    label: "Points Against",
  },
  {
    id: "differential",
    numeric: false,
    disablePadding: true,
    sortable: true,
    label: "Difference",
  },
];
