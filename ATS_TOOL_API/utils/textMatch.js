const natural = require("natural");

const compareText = (resumeText, jobDescription) => {

    const tokenizer = new natural.WordTokenizer();
    const resumeTokens = tokenizer.tokenize(resumeText);
    const jobDescriptionTokens = tokenizer.tokenize(jobDescription);

    let matchedKeywords = 0;
    jobDescriptionTokens.forEach((token) => {
        if (resumeTokens.includes(token)) {
            matchedKeywords++;
        }
    });

    const atsScore = (matchedKeywords / jobDescriptionTokens.length) * 100;
    return atsScore.toFixed(2);
};

const extractEmail = (text) => {
    const emailRegex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+/;
    const match = text.match(emailRegex);
    return match ? match[0] : null;
};

const extractPhone = (text) => {
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?[\d-.]{7,10}/;
    const match = text.match(phoneRegex);
    return match ? match[0] : null;
};

const extractName = (text) => {
    const commonNonNameWords = [
        'resume', 'email', 'phone', 'address', 'objective', 'profile', 'education',
        'experience', 'skills', 'summary', 'computer science', 'bachelor', 'master',
        'phd', 'certifications', 'linkedin', 'github', 'science', 'technology',
        'engineering', 'degree', 'university', 'college'
    ];

    const isCommonWord = (word) => commonNonNameWords.includes(word.toLowerCase());
    const isFullyCapitalized = (word) => /^[A-Z]+$/.test(word);

    const isSectionHeader = (line) => {
        return /(education|experience|skills|summary|certifications)/i.test(line.trim().toLowerCase());
    };

    let nameMatch = text.match(/(?:Name|Candidate|Resume of|Applicant)\s*:\s*([A-Za-z\s]+)/i);
    if (nameMatch) {
        let name = nameMatch[1].trim();
        if (!isCommonWord(name)) {
            return name;
        }
    }

    let lines = text.split('\n').filter(line => line.trim() !== '');

    for (let i = 0; i < Math.min(10, lines.length); i++) {
        let line = lines[i].trim();
        if (isSectionHeader(line)) {
            continue;
        }

        let words = line.split(/\s+/);

        let nameCandidates = words.filter(word => {
            const isCapitalized = /^[A-Z][a-z]+$/.test(word);   // First letter capitalized
            const isFullyCap = isFullyCapitalized(word);        // Entirely uppercase
            return (isCapitalized || isFullyCap) && !isCommonWord(word);
        });

        if (nameCandidates.length >= 1 && nameCandidates.length <= 3) {
            return nameCandidates.join(' ');
        }
    }
    return 'Name not found';
};

const extractLocation = (text) => {
    const commonLocationWords = [
        'email', 'objective', 'profile', 'education',
        'experience', 'skills', 'summary', 'computer science',
        'bachelor', 'master', 'phd', 'certifications',
        'linkedin', 'github', 'degree', 'university', 'college',
        'phone', 'mobile', 'contact', 'resume'
    ];

    const isCommonWord = (word) => commonLocationWords.includes(word.toLowerCase());

    const cleanLocation = (location) => {
        return location.replace(/[\n\r]/g, ' ')
            .replace(/[\d]{5,}/g, '')
            .replace(/\b(?:phone|email|mobile|contact|resume)\b/i, '')
            .replace(/\s+/g, ' ')
            .trim();
    };

    let locationMatch = text.match(/(?:Location|Address|Current Location|Residence|City|Country)\s*:\s*([A-Za-z0-9\s,.-]+)/i);
    if (locationMatch) {
        let location = cleanLocation(locationMatch[1]);
        if (location) {
            return location;
        }
    }

    let lines = text.split('\n').filter(line => line.trim() !== '');

    for (let i = 0; i < Math.min(10, lines.length); i++) {
        let line = lines[i].trim();
        if (commonLocationWords.some(word => line.toLowerCase().includes(word))) {
            continue;
        }

        let cleanedLine = cleanLocation(line);
        if (cleanedLine && cleanedLine.match(/[a-zA-Z]+,\s*[a-zA-Z]+/)) {
            return cleanedLine;
        }
    }
    return 'Location not found';
};

const extractSkills = (text) => {

    const commonSkills = [
        'JavaScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'PHP', 'HTML',
        'CSS', 'React', 'Angular', 'Node.js', 'SQL', 'NoSQL', 'MongoDB',
        'Git', 'Docker', 'Kubernetes', 'Machine Learning', 'Data Analysis',
        'Software Development', 'Project Management', 'Agile', 'Scrum',
        'Problem Solving', 'Communication', 'Teamwork', 'Leadership'
    ];

    const cleanSkill = (skill) => {
        return skill.trim().replace(/\s+/g, ' ');
    };

    let foundSkills = [];
    let lines = text.split('\n').filter(line => line.trim() !== '');

    for (let line of lines) {
        for (let skill of commonSkills) {
            if (line.toLowerCase().includes(skill.toLowerCase())) {
                let cleanedSkill = cleanSkill(skill);
                if (!foundSkills.includes(cleanedSkill)) {
                    foundSkills.push(cleanedSkill);
                }
            }
        }
    }

    return foundSkills;
};

const extractExperience = (text) => {

    const experienceRegex = /(\d+)\s*(years?|months?|yr|mo)/gi;
    let totalExperienceInMonths = 0;

    let lines = text.split('\n').filter(line => line.trim() !== '');

    for (let line of lines) {
        let match;
        while ((match = experienceRegex.exec(line)) !== null) {
            const value = parseInt(match[1], 10);
            const unit = match[2].toLowerCase();

            if (unit.startsWith('year')) {
                totalExperienceInMonths += value * 12;
            } else if (unit.startsWith('month')) {
                totalExperienceInMonths += value;
            }
        }
    }
    const totalYears = Math.floor(totalExperienceInMonths / 12);
    const totalMonths = totalExperienceInMonths % 12;

    return {
        totalYears,
        totalMonths,
        totalExperienceInMonths
    };
};

const extractCurrentOrganization = (text) => {

    const lines = text.split('\n').filter(line => line.trim() !== '');

    const explicitPatterns = [
        /(currently\s*working\s*at|currently\s*employed\s*at|working\s*at|present\s*at|currently\s*at)\s*:\s*([A-Za-z0-9\s&.-]+)/i,
        /(?:currently|present)\s*(?:working\s*at|employed\s*at|at)\s*([A-Za-z0-9\s&.-]+)/i
    ];

    for (const pattern of explicitPatterns) {
        for (const line of lines) {
            const match = line.match(pattern);
            if (match && match[2]) {
                return match[2].trim();
            }
        }
    }

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        const datePattern = /([A-Za-z0-9\s&.-]+)\s*\d{4}\s*-\s*(Present|present)/i;
        const experienceMatch = line.match(datePattern);

        if (experienceMatch) {
            return experienceMatch[1].trim();
        }

        if (/(currently|present|senior|lead|manager)/i.test(line)) {
            const words = line.split(' ');
            const orgIndex = words.findIndex(word => /currently|present/i.test(word));

            if (orgIndex > 0) {
                return words[orgIndex - 1].trim();
            }
        }
    }
    return 'Current organization not found';
};

const extractCandidateDescription = (resumeText) => {
    // Normalize the text
    const normalizedText = resumeText.replace(/\r\n/g, '\n').replace(/\r/g, '\n'); // Handle different line endings
    const lines = normalizedText.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    // Keywords that typically indicate the start of a candidate description
    const descriptionKeywords = /(?:\bsummary\b|\babout me\b|\bprofile\b|\bobjective\b|\bprofessional summary\b|\bpersonal statement\b)/i;

    // Keywords that typically indicate the start of other sections
    const sectionEndKeywords = /(?:\bexperience\b|\beducation\b|\bskills\b|\bemployment\b|\bwork history\b)/i;

    let description = '';
    let capture = false;

    // Loop through the lines to find the candidate description section
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Start capturing text when we find a description keyword
        if (descriptionKeywords.test(line)) {
            capture = true;
            continue; // Skip the line with the keyword
        }

        // Stop capturing when we encounter another section keyword
        if (capture && sectionEndKeywords.test(line)) {
            break; // Stop the loop once we hit the next section
        }

        // Collect the lines as part of the description
        if (capture) {
            description += line + ' ';
        }
    }

    return description.trim() || 'Candidate description not found.';
}

module.exports = {
    compareText, extractEmail, extractPhone, extractName, extractLocation, extractSkills, extractExperience,
    extractCurrentOrganization, extractCandidateDescription
};
