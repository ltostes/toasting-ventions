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
      teamname,
      minimunTeamMembers = 2
    }
  ) {

    const image_size = 30;
    const dx_image = image_size * 0.6;

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

    const dotConfig = Plot.dodgeY({
      fy: "name",
      x: "sessionDate",
      anchor: 'middle',
    });

    const flatGamesData = overviewData
                            .map(
                              (profile) =>
                                profile.games.map((g) => ({ ...g, name: profile.name }))
                            )
                            .flat();
  
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
        Plot.image(
          overviewData,
          Plot.selectFirst({
            fy: "name",
            frameAnchor: "left",
            src: "avatar",
            dx: dx_image,
            height: image_size
          })
        ),
        Plot.dot(
            flatGamesData
            .filter(g => g.numTeamMembers >= minimunTeamMembers)
          , dotConfig 
        ),
        Plot.dot(
            flatGamesData
            .filter(g => g.numTeamMembers < minimunTeamMembers)
          , {
            ...dotConfig,
            strokeOpacity: 0.2,
          }
        ),
      ]
    });
  
    return plot;
  }