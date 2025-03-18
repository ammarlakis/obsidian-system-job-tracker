# Obsidian Job Tracker

This is an **Obsidian** vault template designed for tracking job applications efficiently. It leverages **community plugins** to organize applications, log updates, track statuses, and visualize progress.

## 🌟 Features
- **Structured Job Applications**: Each application is stored in a markdown file with frontmatter metadata, job descriptions, and a log section.
- **Dashboard**: A markdown-based dashboard visualizing job applications using a **Sankey chart**.
- **Canvas View**: An alternative **canvas dashboard** embedding the markdown dashboard for better visibility.
- **Automated Logging & Status Updates**: Scripts to quickly add log entries and update application statuses.
- **User-friendly Forms**: Modal-based forms for adding new job applications.
- **QuickAdd Integration**: Jobs are pre-configured under **QuickAdd: Jobs**, allowing easy access via the command palette.


Here's how it looks like

![Obsidian Job Tracker Visualization](https://github.com/ammarlakis/obsidian-system-job-tracker/blob/master/demo.png?raw=true)

## 🛠 Installation
### 1. Install Obsidian
Download and install **Obsidian** from [obsidian.md](https://obsidian.md).

### 2. Clone or Download this Vault
```sh
# Clone the repository
git clone https://github.com/ammarlakis/obsidian-job-tracker.git
```
Alternatively, download the ZIP and extract it.

### 3. Open in Obsidian
- Launch **Obsidian**.
- Click **Open folder as vault** and select the cloned/downloaded folder.

### 4. Install Required Plugins
Go to **Settings → Community Plugins** and enable:
- [**Charts**](https://github.com/phibr0/obsidian-charts)
- [**Dataview**](https://github.com/blacksmithgu/obsidian-dataview)
- [**Modal Forms**](https://github.com/danielo515/obsidian-modal-form)
- [**QuickAdd**](https://github.com/chhoumann/quickadd)

## 📂 Project Structure

```
📂 Obsidian Job Tracker Vault
 ├── 📂 Applications      # Stores job applications as markdown files
 ├── 📂 scripts           # Contains automation scripts
 │   ├── jobNewApplication.js    # Script to create new job applications
 │   ├── jobAddLogEntry.js       # Script to add a log entry to an application
 │   ├── jobUpdateStatus.js      # Script to update the job application status
 ├── 📝 Dashboard.md      # Main dashboard (Markdown)
 ├── 🎨 Dashboard.canvas  # The dashboard embedded in a canvas
 └── 📜 README.md         # This file
```

## ⚡ Usage
### 1. Add a New Job Application
- Use **QuickAdd → Jobs → New Application**
- Fill in the form
- A markdown file will be created in the **Applications** folder

### 2. Add a Log Entry
- Use **QuickAdd → Jobs → Add Log Entry**
- Select an active application
- Enter a log update
- The log will be appended to the application's markdown file

### 3. Update Application Status
- Use **QuickAdd → Jobs → Update Status**
- Select an active application
- Choose a new status
- The status history and last updated date will be recorded

### 4. View Job Progress
- Open **Dashboard.md** for an overview of your job applications as a **Sankey chart**.
- Open **Dashboard.canvas** for a wider canvas view.

## 🎨 Customization
Certain values can be customized in the **scripts** folder. Look for `TODO: Customize` comments in the scripts to modify:
- Default folder paths
- Default field values (e.g., location, follow-up date)
- Status options

## 🤝 Contributing
Feel free to open an issue or submit a pull request to improve this project!

## 📜 License
This project is licensed under the **MIT License**.

## 🫂 Support Me

I create open-source code and write articles on [my website](https://ammarlakis.com) and [GitHub](https://github.com/ammarlakis), covering topics like automation, platform engineering, and smart home technology.

If you’d like to support my work (or treat my cat to a tuna can!), you can do so here:

[![Buy my cat a tuna can 😸](https://img.buymeacoffee.com/button-api/?text=Buy%20my%20cat%20a%20tuna%20can&emoji=%F0%9F%98%B8&slug=ammarlakis&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff)](https://www.buymeacoffee.com/ammarlakis)
