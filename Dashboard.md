# 📝 Job Applications


```dataviewjs
// Collect all job applications
let data = dv.pages('"Applications"');

// Define the ordered stages
let stages = ["Applied", "Screening", "Hiring Manager", "Technical", "System Design", "Cultural", "Offer", "Rejected"];

// Initialize transition tracking
let counts = {
    total: data.length,
    stageCounts: {},
    transitions: {}
};

// Initialize counts for each stage
stages.forEach(stage => {
    counts.stageCounts[stage] = 0;
});

// Helper function to record transitions
function recordTransition(from, to) {
    if (from && to && from !== to) {
        let key = `${from},${to}`;
        counts.transitions[key] = (counts.transitions[key] || 0) + 1;
    }
}

// Process applications
data.forEach(application => {
    let history = application.history;
    let lastStage = "Applied"; // Default starting stage

	recordTransition("Total", "Applied");

    // Iterate through history to track transitions
    history.forEach(step => {
        if (stages.includes(step)) {
            counts.stageCounts[step] += 1;
            recordTransition(lastStage, step);
            lastStage = step;
        }
    });

    // If the application is finalized, track its last transition
    if (application.stage === "Offer") {
        recordTransition(lastStage, "Offer");
        counts.stageCounts["Offer"] += 1;
    } else if (application.stage === "Rejected") {
        recordTransition(lastStage, "Rejected");
        counts.stageCounts["Rejected"] += 1;
    }
});


// Build Mermaid Sankey Diagram
let mermaidData = "```mermaid\n";
mermaidData +=`---
config:
  sankey:
    nodeAlignment: 'justify'
    width: 2000
---
`
mermaidData += "sankey-beta\n";

// Add transitions with values
for (let [key, value] of Object.entries(counts.transitions)) {
    let [from, to] = key.split(",");
    mermaidData += `${from},${to},${value}\n`;
}

mermaidData += "```";

// Render the chart
dv.span(mermaidData);


```

## 📜 Offers
```dataviewjs

let stages = {
    Applied: {
        icon: "🟢",
        terminal: false,
        active: false
    },
    Screening: {
        icon: "🟡",
        terminal: false,
        active: true
    },
    "Hiring Manager": {
        icon: "🔵",
        terminal: false,
        active: true
    },
    Technical: {
        icon: "🔵",
        terminal: false,
        active: true
    },
    "System Design": {
        icon: "🔵",
        terminal: false,
        active: true
    },
    Cultural: {
        icon: "⚪",
        terminal: false,
        active: true
    },
    Offer: {
        icon: "✅",
        terminal: true,
        active: false
    },
    Rejected: {
        icon: "❌",
        terminal: true,
        active: false
    }
};

function timeAgo(timestamp) {
    let now = new Date();
    let diffInMs = timestamp - now.getTime();
    let diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

    let rtf = new Intl.RelativeTimeFormat('en', { numeric: "auto", style: "narrow" });

    if (diffInDays === 0) return "Today";
    if (diffInDays === -1) return "Yesterday";
    if (diffInDays === 1) return "Tomorrow";
    
    return rtf.format(diffInDays, "day");
}

dv.table(
    ["Company", "Position", "Offer", "Location", "Until"],
    dv.pages('"Applications"')
	.map(p => {
		return {
		    ...p,
		    stage: p.history[p.history.length - 1]
		}}
	)
    .where(p => p.stage == "Offer").map(p => [
        p.company,
        p._position,
        `[[${p.file.path}#Offer|${p._position}]]`,
        p.location,
        timeAgo(p.follow_up_date)
    ])
);
```

## 👨‍💻 Active
```dataviewjs
let stages = {
    Applied: {
        icon: "🟢",
        terminal: false,
        active: false
    },
    Screening: {
        icon: "🟡",
        terminal: false,
        active: true
    },
    "Hiring Manager": {
        icon: "🔵",
        terminal: false,
        active: true
    },
    Technical: {
        icon: "🔵",
        terminal: false,
        active: true
    },
    "System Design": {
        icon: "🔵",
        terminal: false,
        active: true
    },
    Cultural: {
        icon: "⚪",
        terminal: false,
        active: true
    },
    Offer: {
        icon: "✅",
        terminal: true,
        active: false
    },
    Rejected: {
        icon: "❌",
        terminal: true,
        active: false
    }
};

function timeAgo(timestamp) {
    let now = new Date();
    let diffInMs = timestamp - now.getTime();
    let diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

    let rtf = new Intl.RelativeTimeFormat('en', { numeric: "auto", style: "narrow" });

    if (diffInDays === 0) return "Today";
    if (diffInDays === -1) return "Yesterday";
    if (diffInDays === 1) return "Tomorrow";
    
    return rtf.format(diffInDays, "day");
}

dv.table(
    ["Company", "Position", "Stage", "Location", "Last Update", "Follow-up Date"],
    dv.pages('"Applications"')
    .map(p => {
	    return {
		    ...p,
		    stage: p.history[p.history.length - 1]
		}}
	)
    .where(p => stages[p.stage].active)
    .map(p => [
        p.company,
        `[[${p.file.path}|${p._position}]]`,
        `${stages[p.stage].icon} ${p.stage}`,
        p.location,
        timeAgo(p.last_update),
        timeAgo(p.follow_up_date)
    ])
);

```

## 📩 Pending

```dataviewjs
let stages = {
    Applied: {
        icon: "🟢",
        terminal: false,
        active: false
    },
    Screening: {
        icon: "🟡",
        terminal: false,
        active: true
    },
    "Hiring Manager": {
        icon: "🔵",
        terminal: false,
        active: true
    },
    Technical: {
        icon: "🔵",
        terminal: false,
        active: true
    },
    "System Design": {
        icon: "🔵",
        terminal: false,
        active: true
    },
    Cultural: {
        icon: "⚪",
        terminal: false,
        active: true
    },
    Offer: {
        icon: "✅",
        terminal: true,
        active: false
    },
    Rejected: {
        icon: "❌",
        terminal: true,
        active: false
    }
};

function timeAgo(timestamp) {
    let now = new Date();
    let diffInMs = timestamp - now.getTime();
    let diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

    let rtf = new Intl.RelativeTimeFormat('en', { numeric: "auto", style: "narrow" });

    if (diffInDays === 0) return "Today";
    if (diffInDays === -1) return "Yesterday";
    if (diffInDays === 1) return "Tomorrow";
    
    return rtf.format(diffInDays, "day");
}

dv.table(
    ["Company", "Position", "Stage", "Location", "Last Update"],
    dv.pages('"Applications"').array()
    .map(p => {
	    return {
		    ...p,
		    stage: p.history[p.history.length - 1],
		}}
	)
    .filter(p => !stages[p.stage].active && !stages[p.stage].terminal)
    .sort((a, b) => new Date(b.last_update) - new Date(a.last_update))
    .map(p => [
        p.company,
        `[[${p.file.path}|${p._position}]]`,
        `${stages[p.stage].icon} ${p.stage}`,
        p.location,
        timeAgo(p.last_update)
    ])
);
```

