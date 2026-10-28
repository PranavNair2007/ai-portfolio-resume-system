/**
 * =========================================================================
 * GOOGLE APPS SCRIPT: AI Portfolio Management System Synchronization
 * =========================================================================
 *
 * HOW TO DEPLOY (Takes 30 seconds):
 * 1. Open a new Google Sheet (sheets.google.com).
 * 2. In the menu, click: Extensions -> Apps Script.
 * 3. Delete any default code in Code.gs, paste this entire file, and click Save (disk icon).
 * 4. Click the blue "Deploy" button (top right) -> "New deployment".
 * 5. Click the gear icon next to "Select type" -> choose "Web app".
 * 6. Set Description: "Portfolio Sync Webhook"
 *    Execute as: "Me"
 *    Who has access: "Anyone" (allows our portfolio app to push data via HTTP)
 * 7. Click "Deploy", authorize permissions when prompted, and copy the "Web app URL".
 * 8. Paste the Web app URL into the Portfolio System's Google Sheets settings!
 */

function doPost(e) {
  try {
    var rawData = e.postData.contents;
    var data = JSON.parse(rawData);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Set spreadsheet title if provided
    if (data.personal_info && data.personal_info.full_name) {
      ss.setName(data.personal_info.full_name + " - Professional Portfolio Database");
    }

    var recordCounts = {};

    // 1. Overview & Personal Info Tab
    if (data.personal_info) {
      var p = data.personal_info;
      var pSheet = getOrCreateSheet(ss, "Personal_Info", "#1e1b4b");
      pSheet.clear();
      var pData = [
        ["Field", "Value"],
        ["Full Name", p.full_name || ""],
        ["Professional Title", p.title || ""],
        ["Email Address", p.email || ""],
        ["Phone Number", p.phone || ""],
        ["Location", p.location || ""],
        ["LinkedIn URL", p.linkedin || ""],
        ["GitHub URL", p.github || ""],
        ["Portfolio Website", p.portfolio_url || ""],
        ["Executive Summary", p.summary || ""],
        ["Last Synced Timestamp", new Date().toISOString()]
      ];
      writeTable(pSheet, pData);
      recordCounts["Personal_Info"] = 1;
    }

    // 2. Education Tab
    if (data.education && data.education.length) {
      var eduSheet = getOrCreateSheet(ss, "Education", "#1e3a8a");
      eduSheet.clear();
      var eduRows = [["ID", "Institution", "Degree", "Field of Study", "Start Date", "End Date", "GPA", "Honors", "Location"]];
      data.education.forEach(function(item) {
        eduRows.push([
          item.id || "",
          item.institution || "",
          item.degree || "",
          item.field_of_study || "",
          item.start_date || "",
          item.end_date || "",
          item.gpa || "",
          item.honors || "",
          item.location || ""
        ]);
      });
      writeTable(eduSheet, eduRows);
      recordCounts["Education"] = data.education.length;
    }

    // 3. Work Experience Tab
    if (data.experience && data.experience.length) {
      var expSheet = getOrCreateSheet(ss, "Experience", "#065f46");
      expSheet.clear();
      var expRows = [["ID", "Company", "Role", "Type", "Location", "Start Date", "End Date", "Key Achievements / Bullets", "Technologies Used"]];
      data.experience.forEach(function(item) {
        var bullets = Array.isArray(item.bullet_points) ? item.bullet_points.join("\n• ") : (item.bullet_points || "");
        if (bullets && !bullets.startsWith("• ")) bullets = "• " + bullets;
        var techs = Array.isArray(item.technologies) ? item.technologies.join(", ") : (item.technologies || "");
        expRows.push([
          item.id || "",
          item.company || "",
          item.role || "",
          item.experience_type || "Full-time",
          item.location || "",
          item.start_date || "",
          item.is_current ? "Present" : (item.end_date || ""),
          bullets,
          techs
        ]);
      });
      writeTable(expSheet, expRows);
      recordCounts["Experience"] = data.experience.length;
    }

    // 4. Skills Tab
    if (data.skills && data.skills.length) {
      var skillSheet = getOrCreateSheet(ss, "Skills", "#4c1d95");
      skillSheet.clear();
      var skillRows = [["ID", "Skill Name", "Category", "Proficiency Level", "Years Experience", "Featured Flag"]];
      data.skills.forEach(function(item) {
        skillRows.push([
          item.id || "",
          item.name || "",
          item.category || "",
          item.proficiency_level || "",
          item.years_of_experience || 0,
          item.is_featured ? "Yes" : "No"
        ]);
      });
      writeTable(skillSheet, skillRows);
      recordCounts["Skills"] = data.skills.length;
    }

    // 5. Projects Tab
    if (data.projects && data.projects.length) {
      var projSheet = getOrCreateSheet(ss, "Projects", "#701a75");
      projSheet.clear();
      var projRows = [["ID", "Project Title", "Role", "Start Date", "End Date", "Live URL", "GitHub Repo", "Description", "Key Accomplishments", "Tech Stack"]];
      data.projects.forEach(function(item) {
        var bullets = Array.isArray(item.bullet_points) ? item.bullet_points.join("\n• ") : (item.bullet_points || "");
        if (bullets && !bullets.startsWith("• ")) bullets = "• " + bullets;
        var techs = Array.isArray(item.technologies) ? item.technologies.join(", ") : (item.technologies || "");
        projRows.push([
          item.id || "",
          item.title || "",
          item.role || "",
          item.start_date || "",
          item.end_date || "",
          item.url || "",
          item.github_url || "",
          item.description || "",
          bullets,
          techs
        ]);
      });
      writeTable(projSheet, projRows);
      recordCounts["Projects"] = data.projects.length;
    }

    // 6. Certifications Tab
    if (data.certifications && data.certifications.length) {
      var certSheet = getOrCreateSheet(ss, "Certifications", "#831843");
      certSheet.clear();
      var certRows = [["ID", "Certification Name", "Issuing Organization", "Issue Date", "Expiration Date", "Credential ID", "Verification URL"]];
      data.certifications.forEach(function(item) {
        certRows.push([
          item.id || "",
          item.name || "",
          item.issuing_organization || "",
          item.issue_date || "",
          item.expiration_date || "",
          item.credential_id || "",
          item.credential_url || ""
        ]);
      });
      writeTable(certSheet, certRows);
      recordCounts["Certifications"] = data.certifications.length;
    }

    // 7. Achievements Tab
    if (data.achievements && data.achievements.length) {
      var achSheet = getOrCreateSheet(ss, "Achievements", "#9a3412");
      achSheet.clear();
      var achRows = [["ID", "Title", "Category", "Issuer", "Date", "Description"]];
      data.achievements.forEach(function(item) {
        achRows.push([
          item.id || "",
          item.title || "",
          item.category || "",
          item.issuer || "",
          item.date || "",
          item.description || ""
        ]);
      });
      writeTable(achSheet, achRows);
      recordCounts["Achievements"] = data.achievements.length;
    }

    // 8. Publications Tab
    if (data.publications && data.publications.length) {
      var pubSheet = getOrCreateSheet(ss, "Publications", "#0f766e");
      pubSheet.clear();
      var pubRows = [["ID", "Paper Title", "Venue / Conference", "Publication Date", "Authors", "DOI / Link", "Abstract / Description"]];
      data.publications.forEach(function(item) {
        pubRows.push([
          item.id || "",
          item.title || "",
          item.venue || "",
          item.publication_date || "",
          item.authors || "",
          item.doi || item.url || "",
          item.description || ""
        ]);
      });
      writeTable(pubSheet, pubRows);
      recordCounts["Publications"] = data.publications.length;
    }

    // 9. Languages Tab
    if (data.languages && data.languages.length) {
      var langSheet = getOrCreateSheet(ss, "Languages", "#374151");
      langSheet.clear();
      var langRows = [["ID", "Language", "Proficiency Level"]];
      data.languages.forEach(function(item) {
        langRows.push([
          item.id || "",
          item.language || "",
          item.proficiency || ""
        ]);
      });
      writeTable(langSheet, langRows);
      recordCounts["Languages"] = data.languages.length;
    }

    // Remove default Sheet1 if unused
    var defaultSheet = ss.getSheetByName("Sheet1");
    if (defaultSheet && ss.getSheets().length > 1) {
      try { ss.deleteSheet(defaultSheet); } catch(err) {}
    }

    var result = {
      success: true,
      message: "Portfolio successfully exported and synchronized with Google Sheets.",
      sheetUrl: ss.getUrl(),
      spreadsheetId: ss.getId(),
      syncedAt: new Date().toISOString(),
      recordCounts: recordCounts
    };

    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET request: Return the current contents of the Google Sheet back to the caller
 */
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheets = ss.getSheets();
    var result = {
      sheetUrl: ss.getUrl(),
      title: ss.getName(),
      sheets: []
    };

    sheets.forEach(function(sheet) {
      var name = sheet.getName();
      var values = sheet.getDataRange().getValues();
      result.sheets.push({
        name: name,
        rowCount: values.length,
        data: values
      });
    });

    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSheet(ss, sheetName, tabColor) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  if (tabColor) {
    try { sheet.setTabColor(tabColor); } catch(e) {}
  }
  return sheet;
}

function writeTable(sheet, rows) {
  if (!rows || rows.length === 0) return;
  var numRows = rows.length;
  var numCols = rows[0].length;
  
  var range = sheet.getRange(1, 1, numRows, numCols);
  range.setValues(rows);

  // Style Header Row
  var headerRange = sheet.getRange(1, 1, 1, numCols);
  headerRange.setBackground("#312e81"); // Indigo dark
  headerRange.setFontColor("#ffffff");
  headerRange.setFontWeight("bold");
  headerRange.setFontFamily("Arial");
  headerRange.setHorizontalAlignment("center");
  
  // Format body cells
  if (numRows > 1) {
    var bodyRange = sheet.getRange(2, 1, numRows - 1, numCols);
    bodyRange.setFontFamily("Arial");
    bodyRange.setWrap(true);
    bodyRange.setVerticalAlignment("top");
  }

  // Freeze header
  sheet.setFrozenRows(1);

  // Auto-resize columns
  for (var c = 1; c <= numCols; c++) {
    sheet.autoResizeColumn(c);
    var width = sheet.getColumnWidth(c);
    if (width > 400) sheet.setColumnWidth(c, 400); // cap max column width for clean view
    if (width < 90) sheet.setColumnWidth(c, 90);
  }
}
