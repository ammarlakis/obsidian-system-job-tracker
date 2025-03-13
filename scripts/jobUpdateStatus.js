module.exports = async (params) => {
  const dv = app.plugins.plugins.dataview.api;
  const moment = window.moment;
  const folderPath = "Applications"; // TODO: Customize

  // Get all job application files
  let jobFiles;
  try {
    jobFiles = await app.vault
      .getFolderByPath(folderPath)
      .children
  } catch (error) {
    new Notice(`❌ Error listing application files: ${error.message}`);
  }

  let eligibleJobs = [];

  // Filter job applications that haven't been finalized (not Offer/Rejected)
  for (const file of jobFiles) {
    const page = dv.page(file.path);
    if (!page || !page.history || !Array.isArray(page.history)) continue;

    const lastHistory =
      page.history.length > 0 ? page.history[page.history.length - 1] : null;
    if (lastHistory !== "Offer" && lastHistory !== "Rejected") {
      eligibleJobs.push({ file });
    }
  }

  if (eligibleJobs.length === 0) {
    new Notice("⚠️ No active job applications found.");
    return;
  }

  // Show selection form to pick a job
  const jobChoices = eligibleJobs.map((job) => job.file);
  const pickedFile = await params.quickAddApi.suggester(
    (file) => file.basename,
    jobChoices
  );

  if (!pickedFile) {
    new Notice("⚠️ Update status cancelled.");
    return;
  }

  // Ask for history update
  const statusOptions = [        // TODO: Customize
    "Screening",
    "Hiring Manager",
    "Technical",
    "System Design",
    "Cultural",
    "Rejected",
    "Offer",
  ];
  const chosenStatus = await params.quickAddApi.suggester(
    (status) => status,
    statusOptions
  );

  if (!chosenStatus) {
    new Notice("⚠️ No status selected.");
    return;
  }

  const timestamp = moment().format("YYYY-MM-DD"); // TODO: Customize

  // Read existing file content
  let fileContent;
  try {
    fileContent = await app.vault.read(pickedFile);
  } catch (error) {
    new Notice(`❌ Error reading application file: ${error.message}`);
  }

  // Update `history` in YAML frontmatter
  fileContent = fileContent.replace(
    /history:\s*\n([\s\S]*?)\n(?=\S|$)/m,
    (match, historyContent) => {
      return `history:\n${historyContent}\n  - ${chosenStatus}\n`;
    }
  );

  // Update the `last_update` field in YAML
  fileContent = fileContent.replace(
    /last_update: .*/i,
    `last_update: ${timestamp}`
  );

  // Save the updated file
  try {
    await app.vault.modify(pickedFile, fileContent);
  } catch (error) {
    new Notice(`❌ Error updating application status: ${error.message}`);
    return;
  }
  new Notice(`✅ Application ${pickedFile.name} status updated.`);
};
