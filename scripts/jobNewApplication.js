function sanitizeFilename(filename) {
  return filename.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_'); // Replace invalid characters with underscores
}

function validateInput(input) {
  if (!input.company.value) {
    throw new Error("Company is required");
  }
  if (!input._position.value) {
    throw new Error("Position is required");
  }
  if (!input.location.value) {
    throw new Error("Location is required");
  }
  if (!input.jobDescription.value) {
    throw new Error("Job Description is required");
  }
}

module.exports = async () => {
  const modalForm = app.plugins.plugins.modalforms.api;
  const builder = modalForm.builder;
  const form = builder("new-job-application", "New Job Application")
    .text({
      name: "company",
      label: "Company",
      description: "",
      isRequired: true,
    })
    .text({
      name: "_position",
      label: "Position",
      description: "",
      isRequired: true,
    })
    .text({
      name: "location",
      label: "Location",
      description: "",
      isRequired: true,
    })
    .select({
      name: "source",
      label: "Source",
      description: "",
      isRequired: true,
      options: [                // TODO: Customize
        {
          value: "LinkedIn",
          label: "LinkedIn",
        },
        {
          value: "Recruiter",
          label: "Recruiter",
        },
        {
          value: "Company Website",
          label: "Company Website",
        },
      ],
    })
    .date({
      name: "dateApplied",
      label: "Date Applied",
      description: "",
      isRequired: false,
    })
    .date({
      name: "followUpDate",
      label: "Follow-up Date",
      description: "",
      isRequired: false,
    })
    .date({
      name: "lastUpdate",
      label: "Last Update",
      description: "",
      isRequired: false,
      hidden: true,
    })
    .text({
      name: "contactName",
      label: "Contact Name",
      description: "",
      isRequired: false,
      hidden: false,
    })
    .email({
      name: "contactEmail",
      label: "Contact Email",
      description: "",
      isRequired: false,
      condition: {
        type: "isSet",
        dependencyName: "contactName",
      },
      hidden: false,
    })
    .number({
      name: "salaryExpectation",
      label: "Salary Expectation",
      description: "",
      isRequired: false,
      hidden: false,
    })
    .textarea({
      name: "jobDescription",
      label: "Job Description",
      description: "",
      hidden: false,
      isRequired: true,
    })
    .textarea({
      name: "notes",
      label: "Notes",
      description: "",
      isRequired: false,
      hidden: false,
    })
    .tag({
      name: "tags",
      label: "Tags",
      description: "",
      isRequired: true,
      hidden: false,
    })
    .build();

  const moment = window.moment;
  const dateFormat = "YYYY-MM-DD"     // TODO: Customize

  // Application files path
  const folderPath = "Applications";  // TODO: Customize

  // Default form values
  const values = {                    // TODO: Customize
    location: "Munich, Germany",
    source: "LinkedIn",
    dateApplied: moment().format(dateFormat),
    followUpDate: moment().add(14, "days").format(dateFormat),    // Automatically set a 14 days follow-up date
    lastUpdate: moment().format(dateFormat),
  };

  const result = await modalForm.openForm(form, {
    values: values,
  });


  if (result.status != "ok") {
    new Notice("⚠️ Job application creation canceled")
  } else {
    try {
      validateInput(result);
    } catch (error) {
      new Notice(error.message);
      return;
    }

    const fileName = sanitizeFilename(`${result.company} - ${result._position} - ${result.dateApplied}.md`);
    const filePath = `${folderPath}/${fileName}`;

    let contact = result.contactName.value? `${result.contactName}`: "";
    contact += result.contactEmail.value? ` <${result.contactEmail}>`: "";

    const noteContent = `---
        company: ${result.company}
        _position: ${result._position}
        location: ${result.location}
        source: ${result.source}
        date_applied: ${result.dateApplied}
        follow_up_date: ${result.followUpDate}
        last_update: ${result.lastUpdate}
        contact: ${contact}
        salary_expectation: ${result.salaryExpectation}
        history:
          - Applied
        notes: |-
        ${result.notes.value?.replaceAll(/^\s*/gm, "  ") || "" }
        tags:
        ${result.tags.bullets}
        ---
        ## Description
        
        ${result.jobDescription}
        
        ---
        
        ## Log
        `.replace(/^ {8}/gm, "");

    try {
      await app.vault.create(filePath, noteContent);
    } catch (error) {
      new Notice(`❌ Error creating job application: ${error.message}`)
      return;
    }
    new Notice(`✅ Job application created: ${fileName}.`);
  }
};
