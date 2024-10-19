import * as d3 from 'd3';
import * as Plot from '@observablehq/plot';

export function overviewGraph(
    overviewData,
    {
      ordering_1,
      ordering_2,
      width,
      height,
      marginLeft,
      insetLeft,
      refDate,
      timerange,
      teamname
    }
  ) {

    const fy_domain = [
      teamname,
      ...d3
        .sort(
          overviewData,
          (a, b) =>
            d3.descending(a[ordering_1], b[ordering_1]) ||
            d3.descending(a[ordering_2], b[ordering_2])
        )
        .map((d) => d.name)
    ];
  
    const x_domain = [refDate, d3.utcDay.offset(refDate, -timerange)];
  
    const plot = Plot.plot({
      width,
      height,
      marginLeft,
      insetLeft,
      x: {
        type: "utc",
        axis: "top",
        grid: true,
        domain: x_domain
      },
      fy: {
        label: null,
        domain: fy_domain
      },
      marks: [
        Plot.dot(
          overviewData
            .map(
              (profile) =>
                profile.games.map((g) => ({ ...g, name: profile.name }))
              // .filter(g => isDateWithinRange(g.finishedAt, ))
            )
            .flat(),
          Plot.dodgeY({
            fy: "name",
            x: "finishedAt",
            // fill: 'weeksAgo'
          })
        )
      ]
    });
  
    return plot;
  }