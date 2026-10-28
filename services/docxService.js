const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, UnderlineType, BorderStyle } = require('docx');

/**
 * Generate a modern, ATS-compliant Microsoft Word (.docx) resume
 */
async function generateDocxResume(resumeData) {
    const {
        personal_info = {},
        tailored_summary = '',
        selected_skills = [],
        selected_experience = [],
        selected_projects = [],
        selected_education = [],
        selected_certifications = [],
        selected_publications = [],
        accent_color = '2563EB' // Hex without #
    } = resumeData;

    const cleanAccentColor = (accent_color || '2563EB').replace('#', '');

    const docChildren = [];

    // 1. Header: Name & Contact
    docChildren.push(
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
            children: [
                new TextRun({
                    text: personal_info.full_name || 'Candidate Name',
                    bold: true,
                    size: 36, // 18pt
                    font: 'Arial',
                    color: cleanAccentColor
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
                new TextRun({
                    text: personal_info.title || 'Software Professional',
                    bold: true,
                    size: 22, // 11pt
                    font: 'Arial',
                    color: '4B5563'
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 240 },
            children: [
                new TextRun({ text: [personal_info.email, personal_info.phone, personal_info.location].filter(Boolean).join('  |  '), size: 18, font: 'Arial', color: '374151' }),
                new TextRun({ text: personal_info.linkedin ? `  |  LinkedIn: ${personal_info.linkedin}` : '', size: 18, font: 'Arial', color: cleanAccentColor }),
                new TextRun({ text: personal_info.github ? `  |  GitHub: ${personal_info.github}` : '', size: 18, font: 'Arial', color: cleanAccentColor })
            ]
        })
    );

    // Helper for Section Headings
    function addSectionHeading(title) {
        docChildren.push(
            new Paragraph({
                spacing: { before: 200, after: 100 },
                border: {
                    bottom: { color: cleanAccentColor, space: 4, style: BorderStyle.SINGLE, size: 12 }
                },
                children: [
                    new TextRun({
                        text: title.toUpperCase(),
                        bold: true,
                        size: 22,
                        font: 'Arial',
                        color: cleanAccentColor
                    })
                ]
            })
        );
    }

    // 2. Professional Summary
    const summaryText = tailored_summary || personal_info.summary;
    if (summaryText) {
        addSectionHeading('Professional Summary');
        docChildren.push(
            new Paragraph({
                spacing: { after: 180 },
                children: [
                    new TextRun({
                        text: summaryText,
                        size: 20,
                        font: 'Arial',
                        color: '1F2937'
                    })
                ]
            })
        );
    }

    // 3. Technical & Core Skills
    if (selected_skills && selected_skills.length > 0) {
        addSectionHeading('Core Technical Competencies');

        // Group skills by category if available, or list
        const grouped = {};
        for (const s of selected_skills) {
            const cat = s.category || 'Technical Skills';
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(s.name);
        }

        for (const [category, skillNames] of Object.entries(grouped)) {
            docChildren.push(
                new Paragraph({
                    spacing: { after: 80 },
                    children: [
                        new TextRun({ text: `• ${category}: `, bold: true, size: 19, font: 'Arial', color: '1F2937' }),
                        new TextRun({ text: skillNames.join(', '), size: 19, font: 'Arial', color: '374151' })
                    ]
                })
            );
        }
    }

    // 4. Work Experience
    if (selected_experience && selected_experience.length > 0) {
        addSectionHeading('Professional Experience');

        for (const exp of selected_experience) {
            const dateStr = `${exp.start_date} – ${exp.is_current ? 'Present' : exp.end_date || 'Present'}`;
            docChildren.push(
                new Paragraph({
                    spacing: { before: 120, after: 40 },
                    children: [
                        new TextRun({ text: exp.role, bold: true, size: 21, font: 'Arial', color: '111827' }),
                        new TextRun({ text: `  —  ${exp.company}`, bold: false, italics: true, size: 20, font: 'Arial', color: '374151' }),
                        new TextRun({ text: `   (${dateStr} | ${exp.location || ''})`, size: 18, font: 'Arial', color: '6B7280' })
                    ]
                })
            );

            // Bullets
            const bullets = Array.isArray(exp.bullet_points) ? exp.bullet_points : [];
            for (const bullet of bullets) {
                docChildren.push(
                    new Paragraph({
                        bullet: { level: 0 },
                        spacing: { after: 60 },
                        children: [
                            new TextRun({ text: bullet, size: 19, font: 'Arial', color: '1F2937' })
                        ]
                    })
                );
            }
        }
    }

    // 5. Featured Projects
    if (selected_projects && selected_projects.length > 0) {
        addSectionHeading('Key Engineering Projects');

        for (const proj of selected_projects) {
            docChildren.push(
                new Paragraph({
                    spacing: { before: 120, after: 40 },
                    children: [
                        new TextRun({ text: proj.title, bold: true, size: 21, font: 'Arial', color: '111827' }),
                        new TextRun({ text: proj.role ? `  (${proj.role})` : '', italics: true, size: 19, font: 'Arial', color: '4B5563' }),
                        new TextRun({ text: proj.url ? `  —  ${proj.url}` : '', size: 18, font: 'Arial', color: cleanAccentColor })
                    ]
                })
            );

            if (proj.description) {
                docChildren.push(
                    new Paragraph({
                        spacing: { after: 60 },
                        children: [
                            new TextRun({ text: proj.description, size: 19, font: 'Arial', italics: true, color: '4B5563' })
                        ]
                    })
                );
            }

            const bullets = Array.isArray(proj.bullet_points) ? proj.bullet_points : [];
            for (const bullet of bullets) {
                docChildren.push(
                    new Paragraph({
                        bullet: { level: 0 },
                        spacing: { after: 60 },
                        children: [
                            new TextRun({ text: bullet, size: 19, font: 'Arial', color: '1F2937' })
                        ]
                    })
                );
            }
        }
    }

    // 6. Education
    if (selected_education && selected_education.length > 0) {
        addSectionHeading('Education');

        for (const edu of selected_education) {
            docChildren.push(
                new Paragraph({
                    spacing: { before: 100, after: 40 },
                    children: [
                        new TextRun({ text: `${edu.degree} in ${edu.field_of_study}`, bold: true, size: 20, font: 'Arial', color: '111827' }),
                        new TextRun({ text: `  |  ${edu.institution}`, size: 19, font: 'Arial', color: '374151' }),
                        new TextRun({ text: `  (${edu.start_date} – ${edu.end_date})`, size: 18, font: 'Arial', color: '6B7280' })
                    ]
                })
            );

            if (edu.honors || edu.gpa) {
                docChildren.push(
                    new Paragraph({
                        spacing: { after: 80 },
                        children: [
                            new TextRun({ text: [edu.gpa ? `GPA: ${edu.gpa}` : '', edu.honors ? `Honors: ${edu.honors}` : ''].filter(Boolean).join('  •  '), size: 18, font: 'Arial', color: '4B5563' })
                        ]
                    })
                );
            }
        }
    }

    // 7. Certifications
    if (selected_certifications && selected_certifications.length > 0) {
        addSectionHeading('Certifications & Accreditations');

        for (const cert of selected_certifications) {
            docChildren.push(
                new Paragraph({
                    bullet: { level: 0 },
                    spacing: { after: 60 },
                    children: [
                        new TextRun({ text: cert.name, bold: true, size: 19, font: 'Arial', color: '1F2937' }),
                        new TextRun({ text: ` — ${cert.issuing_organization} (${cert.issue_date})`, size: 18, font: 'Arial', color: '4B5563' })
                    ]
                })
            );
        }
    }

    // 8. Publications
    if (selected_publications && selected_publications.length > 0) {
        addSectionHeading('Research & Publications');

        for (const pub of selected_publications) {
            docChildren.push(
                new Paragraph({
                    bullet: { level: 0 },
                    spacing: { after: 60 },
                    children: [
                        new TextRun({ text: `"${pub.title}"`, bold: true, size: 19, font: 'Arial', color: '1F2937' }),
                        new TextRun({ text: ` — ${pub.venue} (${pub.publication_date})`, size: 18, font: 'Arial', color: '4B5563' })
                    ]
                })
            );
        }
    }

    const doc = new Document({
        sections: [
            {
                properties: {
                    page: {
                        margin: {
                            top: 720,    // 0.5 inch
                            right: 720,
                            bottom: 720,
                            left: 720
                        }
                    }
                },
                children: docChildren
            }
        ]
    });

    return await Packer.toBuffer(doc);
}

module.exports = {
    generateDocxResume
};
