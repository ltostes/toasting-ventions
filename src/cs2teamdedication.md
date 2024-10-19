---
title: Sauna Gamer
toc: false
theme: air
---

# Sauna Gamer
_CS2 Team Dedication Performance Report_

### Overview

```js
import { overviewFeatures } from './cs2teamdedication/overview/features.js';
import { overviewGraph } from './cs2teamdedication/overview/plot.js';
```

```js
const ordering_1 = "weekStreak";
const ordering_2 = "gameCountLast5weeks";

const maxWeeksAgo = 10;
const teamname = 'Sauna Gamer'

const params = {
    ordering_1,
    ordering_2,
    width: width,
    height: 1000,
    marginLeft: 150,
    insetLeft: 50,
    refDate: new Date(),
    maxWeeksAgo,
    timerange: maxWeeksAgo * 7,
    sessionDateColumn: "finishedAt",
    teamname
};

const overviewData = overviewFeatures(baseProfileData, params);
const overviewPlot = overviewGraph(overviewData, params);

// return overviewData;
view(overviewPlot)
```

#### Debuging

```js
view(overviewData)
```

```js
// const debuggingInfo = FileAttachment("cs2teamdedication/data/data/infoForDebugging.json").json();
const baseProfileData = FileAttachment("cs2teamdedication/data/data/profiles_matches.json").json();
```

```js
// debuggingInfo
```