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
    new Notice("⚠️  Log entry addition cancelled.");
    return;
  }

  // Ask for log entry
  let logInput = await params.quickAddApi.wideInputPrompt("Entry");

  if (!logInput) {
    new Notice("⚠️  Log entry was empty or cancelled.");
    return;
  }

  const test = logInput.replaceAll(/^\s*/gm, "  ");
  console.log(test)

  const timestamp = moment().format("YYYY-MM-DD");

  // Read existing file content
  let fileContent = await app.vault.read(pickedFile);

  // Update the `last_update` field in YAML
  fileContent = fileContent.replace(
    /last_update: .*/i,
    `last_update: ${timestamp}`
  );

  // Append log entry directly under `## Log`
  const logHeaderMatch = fileContent.match(/## Log/g);
  if (!logHeaderMatch) {
    // If `## Log` doesn't exist, create it at the end
    fileContent += `\n\n## Log\n- **${timestamp}** – ${test}\n`;
  } else {
    // Find the position of `## Log`
    const logHeaderIndex = fileContent.indexOf("## Log");

    // Find the next header (`## SomethingElse`) that comes after `## Log`
    const nextHeaderMatch = fileContent
      .slice(logHeaderIndex + 7)
      .match(/^## .*/m);
    let insertIndex = fileContent.length; // Default to end of file

    if (nextHeaderMatch) {
      // If there's another `##` header, set the insert index before it
      insertIndex = logHeaderIndex + 7 + nextHeaderMatch.index;
    }

    // Insert the log entry at the correct position
    fileContent =
      fileContent.slice(0, insertIndex) +
      `- **${timestamp}** – ${test}\n` +
      fileContent.slice(insertIndex);
  }

  // Save the updated file
  try {
    await app.vault.modify(pickedFile, fileContent);
  } catch (error) {
    new Notice(`❌ Error adding lot entry: ${error.message}`);
    return;
  }
  new Notice(`✅ Log entry added to ${pickedFile.name}`);
};
