# Academics — destination plan

Every one of the 260 extracted consts, and where it goes.

| Destination | Meaning | Count |
|---|---|---|
| CMS | a section part on an Academic Topic | 151 |
| MEDIA | a photograph, uploaded and linked | 15 |
| DERIVED | computed at render time, never stored | 8 |
| SITE | Site Settings already owns it | 23 |
| DESIGN | layout, geometry, palette — stays in code | 63 |
| **UNCLASSIFIED** | **must be empty** | **0** |

## CMS — 151

### `components/academics/AffiliationDetailsPage.astro`

- `points` → **points** ×3 — {n, k, i, body}
- `rows` → **points** ×7 — {k, v, i, mono}
### `components/academics/assessment/AsRailSlider.astro`

- `totalLabel` → **scalar** — editorial string
### `components/academics/assessment/AssessmentPage.astro`

- `conversation` → **facts** ×4 — a list of strings
- `facets` → **points** ×4 — {mark, k, v}
- `GLOSS` → **facts** ×6 — a list of strings
- `MARKS` → **facts** ×6 — a list of strings
- `next` → **points** ×4 — {n, mark, k, v}
- `steps` → **points** ×6 — {n, mark, k, v, gloss}
- `structure` → **points** ×4 — {n, mark, k, v}
- `support` → **points** ×4 — {n, mark, k, v, href}
### `components/academics/assessment/BoardResultsPage.astro`

- `absent` → **points** ×4 — {mark, k}
- `strip` → **points** ×4 — {n, mark, k, v}
### `components/academics/assessment/CareerGuidancePage.astro`

- `benefits` → **points** ×4 — {n, mark, k, v}
- `record` → **points** ×5 — {n, mark, k, v}
### `components/academics/assessment/CompetitiveExamPage.astro`

- `features` → **points** ×4 — {n, mark, k, sub, v}
- `programmes` → **points** ×5 — {n, k, v}
### `components/academics/assessment/HomeworkPolicyPage.astro`

- `ask` → **facts** ×4 — a list of strings
- `assumed` → **points** ×4 — {k, v}
- `framework` → **points** ×4 — {n, mark, k, v}
- `places` → **points** ×3 — {mark, k, v, href}
- `published` → **points** ×2 — {k, v}
- `unknown` → **points** ×4 — {mark, k}
### `components/academics/assessment/MentoringPage.astro`

- `journey` → **points** ×4 — {n, mark, k, v}
- `people` → **points** ×4 — {n, mark, k, v}
- `roles` → **points** ×4 — {n, mark, k, v}
### `components/academics/assessment/OlympiadPage.astro`

- `categories` → **facts** ×4 — a list of strings
- `facts` → **points** ×3 — {mark, k, v}
- `programmes` → **points** ×6 — {mark, k, v}
### `components/academics/assessment/ParentTeacherPage.astro`

- `channels` → **points** ×4 — {mark, k, v}
- `reasons` → **points** ×4 — {n, mark, k, v}
### `components/academics/assessment/RemedialSupportPage.astro`

- `journey` → **points** ×4 — {n, mark, k, v}
- `rules` → **points** ×5 — {mark, k, v}
### `components/academics/assessment/ScholarshipsPage.astro`

- `phoneHref` → **scalar** — editorial string
### `components/academics/assessment/SubjectSelectionPage.astro`

- `covered` → **facts** ×4 — a list of strings
- `process` → **points** ×4 — {n, k, v}
- `routes` → **points** ×4 — {n, mark, k, v}
- `streams` → **facts** ×4 — a list of strings
- `visual` → **points** ×4 — {k, v, art, alt, cap} — cards with a photograph
### `components/academics/assessment/SuccessStoriesPage.astro`

- `phoneShow` → **scalar** — editorial string
### `components/academics/assessment/UniversityCounsellingPage.astro`

- `destinations` → **points** ×4 — {n, mark, k, v}
### `components/academics/CounterStrip.astro`

- `items` → **stats** ×8 — {n, suffix, label} counters
### `components/academics/CriticalThinkingPage.astro`

- `arc` → **points** ×4 — {k, mark}
- `verbs` → **points** ×6 — {k, mark}
### `components/academics/CurriculumPage.astro`

- `philosophy` → **points** ×5 — {k, mark, tone, v}
- `resources` → **points** ×3 — {k, mark, tone, v, href}
- `stages` → **details** ×5 — curriculum stages
- `streams` → **points** ×4 — {k, mark, tone, v}
### `components/academics/ExperientialPage.astro`

- `path` → **points** ×3 — {k, art, photo, alt, body} — cards with a photograph
- `real` → **points** ×3 — {k, note}
### `components/academics/ParentOrientationPage.astro`

- `frameAlt` → **labelledStrings** ×4 — a key → prose map
- `frames` → **points** ×4 — numbered keys
- `months` → **details** ×3 — {m, d} month rows
- `timeline` → **details** ×5 — a dated timeline
### `components/academics/parents/Workshops.astro`

- `cards` → **points** ×6 — {n, title, format, body, chips, photo, alt, image, fact}
### `components/academics/partnership/ParentEngagementPage.astro`

- `plates` → **scalar** — editorial string
### `components/academics/partnership/ParentsForumPage.astro`

- `plates` → **scalar** — editorial string
### `components/academics/partnership/SchoolParentCommunicationPage.astro`

- `channels` → **points** ×4 — {n, mark, k, value, href, why}
### `components/academics/PhilosophyStory.astro`

- `aims` → **points** ×4 — numbered cards
- `bodies` → **facts** ×4 — a list of strings
- `evidence` → **points** ×6 — {k, v}
- `facts` → **points** ×5 — {k, v}
- `journey` → **points** ×5 — {s, v} steps
- `triad` → **points** ×3 — {k, v, art, alt} — cards with a photograph
### `components/academics/SectionHead.astro`

- `Heading` → **scalar** — editorial string
### `components/academics/structure/MiddleSchoolPage.astro`

- `directions` → **points** ×4 — {n, mark, k, v}
- `journey` → **points** ×4 — {n, mark, k, v}
- `marks` → **points** ×4 — {n, mark, k, v}
- `rail` → **points** ×4 — {mark, k, v}
- `shifts` → **points** ×4 — {n, k, v}
- `subjects` → **points** ×8 — {n, mark, k, v, hired}
### `components/academics/structure/PrePrimaryPage.astro`

- `doing` → **points** ×3 — {n, k, sub, v, photo, alt, cap} — cards with a photograph
- `first` → **points** ×3 — {k, v, nx, ny}
- `focus` → **facts** ×3 — a list of strings
- `place` → **points** ×4 — {n, mark, k, v}
- `zone` → **points** ×5 — {n, mark, k}
### `components/academics/structure/PrimaryPage.astro`

- `approach` → **points** ×4 — {k, v}
- `journey` → **points** ×4 — {n, mark, k, v}
- `pillars` → **points** ×4 — {n, mark, k, v}
- `record` → **points** ×5 — {who, k, v}
- `spaces` → **facts** ×6 — a list of strings
- `staff` → **points** ×7 — {mark, k, v}
- `values` → **points** ×3 — {n, mark, k, v}
### `components/academics/structure/SecondaryPage.astro`

- `beyond` → **facts** ×7 — a list of strings
- `deeper` → **points** ×4 — {n, mark, k, v}
- `guest` → **points** ×4 — {n, mark, k, v}
- `journey` → **points** ×4 — {n, mark, k, v}
- `rooms` → **points** ×4 — {mark, k, v}
### `components/academics/structure/SeniorSecondaryPage.astro`

- `beyond` → **points** ×4 — {mark, k, v}
- `cards` → **points** ×4 — {mark, k, v}
- `further` → **facts** ×7 — a list of strings
- `journey` → **points** ×4 — {n, mark, k, v}
- `routes` → **points** ×4 — {n, mark, k, v}
- `streams` → **facts** ×4 — a list of strings
### `components/academics/structure/StreamsOfferedPage.astro`

- `certainty` → **points** ×3 — {mark, k, body, state}
- `streams` → **points** ×4 — named cards
### `components/academics/structure/SubjectCombinationsPage.astro`

- `META` → **points** ×4 — numbered keys
- `SUBJECT_MARK` → **labelledStrings** ×11 — a key → prose map
- `worlds` → **streams** ×4 — streams with subject lists
### `components/academics/teaching/ExperientialLearningPage.astro`

- `beats` → **points** ×3 — {mark, k}
- `stops` → **points** ×6 — {n, k, body, photo, alt, owed} — cards with a photograph
### `components/academics/teaching/LaboratoriesClubsPage.astro`

- `facts` → **points** ×4 — {mark, n, k, v}
- `rooms` → **points** ×12 — {mark, k, v, inquiry}
- `spaces` → **points** ×4 — {n, mark, k, v}
### `components/academics/teaching/MethodologyPage.astro`

- `platforms` → **points** ×4 — {n, mark, k, body}
- `three` → **points** ×3 — {n, mark, k, anchor, body, quote}
### `components/academics/teaching/ReadingLanguagePage.astro`

- `facts` → **points** ×4 — {mark, n, k, v}
- `index` → **points** ×5 — {k, v}
- `stages` → **points** ×4 — {n, mark, k, v}
### `components/academics/teaching/SmartClassroomsPage.astro`

- `beyond` → **points** ×3 — {n, mark, k, body}
- `system` → **points** ×4 — {n, suffix, mark, k, dur}
### `components/academics/teaching/StemRoboticsPage.astro`

- `eco` → **points** ×4 — {mark, k, v, photo, alt} — cards with a photograph
- `kit` → **points** ×4 — {n, mark, k, v}
### `data/academics.ts`

- `affiliation` → **block** ×4 — an editorial block
- `assessmentTopics` → **topics** ×7 — topic records — one page each
- `awaiting` → **points** ×3 — {id, title, body}
- `chapters` → **details** ×6 — titled links
- `combinationsFootnote` → **scalar** — editorial string
- `counters` → **stats** ×8 — {n, suffix, label} counters
- `cycle` → **points** ×6 — cycle steps
- `facilities` → **points** ×7 — {title, fact, body, photo, alt, span}
- `guidance` → **points** ×4 — {label, body} cards
- `heroStats` → **stats** ×3 — {n, suffix, label} counters
- `parents` → **blockMap** ×12 — named editorial blocks — one section each
- `partnership` → **points** ×7 — partnership phases
- `partnershipPhases` → **facts** ×3 — a list of strings
- `philosophy` → **points** ×7 — {n, title, mark, what, anchor}
- `stages` → **points** ×5 — stage cards
- `streamAdditional` → **facts** ×6 — a list of strings
- `streamDetail` → **streams** ×4 — streams with subject lists
- `streamOptional` → **facts** ×5 — a list of strings
- `supports` → **points** ×6 — {label, body} cards
- `teachingLearning` → **blockMap** ×6 — named editorial blocks — one section each
- `teachingPhilosophy` → **block** ×6 — an editorial block
- `wins` → **points** ×6 — dated wins
### `data/academicTopics.ts`

- `careerTopics` → **topics** ×9 — topic records — one page each
- `parentTopics` → **topics** ×7 — topic records — one page each
- `philosophyTopics` → **topics** ×7 — topic records — one page each
- `structureTopics` → **topics** ×8 — topic records — one page each
### `data/parentsForum.ts`

- `agendaHeading` → **scalar** — editorial string
- `commsBenefits` → **points** ×5 — {n, mark, k, v}
- `engagementFacts` → **points** ×5 — {n, mark, k, v}
- `forumAgenda` → **points** ×12 — {n, mark, k, note}
- `forumBenefits` → **points** ×5 — {n, mark, k, v}
- `forumNameplates` → **facts** ×5 — a list of strings
### `data/studentSuccess.ts`

- `recognitionPaths` → **points** ×4 — {n, mark, k, v, href}
- `scholarships` → **facts** ×0 — empty in the source, and stays empty
- `successMilestones` → **points** ×4 — {n, mark, k, v}
### `data/teachingTopics.ts`

- `teachingTopics` → **topics** ×7 — topic records — one page each
### `pages/academics/parent-partnership/faqs.astro`

- `facts` → **points** ×5 — {k, v, s}
- `faqs` → **details** ×7 — questions and answers

## MEDIA — 15

### `components/academics/assessment/CareerGuidancePage.astro`

- `story` → **photos** ×5 — a photograph list
### `components/academics/assessment/CompetitiveExamPage.astro`

- `gallery` → **photos** ×4 — a photograph list
### `components/academics/ParentOrientationPage.astro`

- `stepPhoto` → **photoMap** ×4 — a key → photograph map
### `components/academics/parents/Forum.astro`

- `shots` → **photos** ×3 — a photograph list
### `components/academics/parents/Workshops.astro`

- `photos` → **photoMap** ×6 — a key → photograph map
### `components/academics/structure/Streams.astro`

- `shots` → **photos** ×4 — a photograph list
### `components/academics/StudentCentredPage.astro`

- `orbit` → **photos** ×9 — a photograph list
### `components/academics/teaching/StemRail.astro`

- `photos` → **photoMap** ×5 — a key → photograph map
### `components/academics/teaching/StemRoboticsPage.astro`

- `shots` → **photos** ×6 — a photograph list
### `components/academics/TeachingPhilosophyPage.astro`

- `abilities` → **photos** ×7 — a photograph list
### `data/studentSuccess.ts`

- `careerGuidanceImages` → **photos** ×8 — a photograph list
- `olympiads` → **photos** ×6 — a photograph list
- `successStories` → **photos** ×3 — a photograph list
- `universityResults` → **photos** ×8 — a photograph list
### `pages/academics/index.astro`

- `look` → **photoMap** ×3 — a key → {photograph, alt} map

## DERIVED — 8

### `components/academics/assessment/ScholarshipsPage.astro`

- `hasScholarships` — a count or a flag computed from content
### `components/academics/ChapterNav.astro`

- `i` — a count or a flag computed from content
- `prev` — null placeholder
### `components/academics/CurriculumPage.astro`

- `totalDocs` — a count or a flag computed from content
### `components/academics/parents/Intro.astro`

- `channelCount` — a count or a flag computed from content
### `components/academics/structure/Combinations.astro`

- `anyUnverified` — a count or a flag computed from content
- `electivesOwed` — a count or a flag computed from content
### `components/academics/TeachingPhilosophyPage.astro`

- `R` — a count or a flag computed from content

## SITE — 23

### `components/academics/assessment/AssessmentPage.astro`

- `S` — the school name — Site Settings owns it
### `components/academics/assessment/BoardResultsPage.astro`

- `S` — the school name — Site Settings owns it
### `components/academics/assessment/CareerGuidancePage.astro`

- `S` — the school name — Site Settings owns it
### `components/academics/assessment/CompetitiveExamPage.astro`

- `S` — the school name — Site Settings owns it
### `components/academics/assessment/HomeworkPolicyPage.astro`

- `S` — the school name — Site Settings owns it
### `components/academics/assessment/MentoringPage.astro`

- `S` — the school name — Site Settings owns it
### `components/academics/assessment/OlympiadPage.astro`

- `S` — the school name — Site Settings owns it
### `components/academics/assessment/RemedialSupportPage.astro`

- `S` — the school name — Site Settings owns it
### `components/academics/assessment/UniversityCounsellingPage.astro`

- `S` — the school name — Site Settings owns it
### `components/academics/partnership/ParentEngagementPage.astro`

- `S` — the school name — Site Settings owns it
### `components/academics/partnership/ParentsForumPage.astro`

- `S` — the school name — Site Settings owns it
### `components/academics/structure/MiddleSchoolPage.astro`

- `S` — the school name — Site Settings owns it
### `components/academics/structure/PrePrimaryPage.astro`

- `S` — the school name — Site Settings owns it
### `components/academics/structure/PrimaryPage.astro`

- `S` — the school name — Site Settings owns it
### `components/academics/structure/SecondaryPage.astro`

- `S` — the school name — Site Settings owns it
### `components/academics/teaching/ExperientialLearningPage.astro`

- `S` — the school name — Site Settings owns it
### `components/academics/teaching/LaboratoriesClubsPage.astro`

- `S` — the school name — Site Settings owns it
### `components/academics/teaching/MethodologyPage.astro`

- `S` — the school name — Site Settings owns it
### `components/academics/teaching/ReadingLanguagePage.astro`

- `S` — the school name — Site Settings owns it
### `components/academics/teaching/SmartClassroomsPage.astro`

- `S` — the school name — Site Settings owns it
### `components/academics/teaching/StemRoboticsPage.astro`

- `S` — the school name — Site Settings owns it
### `pages/academics/philosophy/curriculum.astro`

- `school` — the school name — Site Settings owns it
### `pages/academics/student-success/alumni-interaction.astro`

- `school` — the school name — Site Settings owns it

## DESIGN — 63

### `components/academics/AcademicGlyph.astro`

- `glyphs` — a glyph or geometry table
### `components/academics/AffiliationDetailsPage.astro`

- `ICON` — a glyph or geometry table
### `components/academics/assessment/AssessmentPage.astro`

- `CALENDAR` — a route constant — navigation, stays in code
- `MENTORING` — a route constant — navigation, stays in code
- `REMEDIAL` — a route constant — navigation, stays in code
- `RING` — a glyph or geometry table
### `components/academics/assessment/BoardResultsPage.astro`

- `CONTACT` — a route constant — navigation, stays in code
### `components/academics/assessment/CareerGuidancePage.astro`

- `ACTIVITY` — a route constant — navigation, stays in code
- `FACILITIES` — a route constant — navigation, stays in code
- `UNIVERSITY` — a route constant — navigation, stays in code
### `components/academics/assessment/CompetitiveExamPage.astro`

- `STEM` — a route constant — navigation, stays in code
- `UNIVERSITY` — a route constant — navigation, stays in code
### `components/academics/assessment/HomeworkPolicyPage.astro`

- `ASSESSMENT` — a route constant — navigation, stays in code
- `CALENDAR` — a route constant — navigation, stays in code
### `components/academics/assessment/MentoringPage.astro`

- `ASSESSMENT` — a route constant — navigation, stays in code
### `components/academics/assessment/OlympiadPage.astro`

- `STORIES` — a route constant — navigation, stays in code
### `components/academics/assessment/ParentTeacherPage.astro`

- `ASSESSMENT` — a route constant — navigation, stays in code
- `CALENDAR` — a route constant — navigation, stays in code
### `components/academics/assessment/RemedialSupportPage.astro`

- `MENTORING` — a route constant — navigation, stays in code
### `components/academics/assessment/ScholarshipsPage.astro`

- `CONTACT` — a route constant — navigation, stays in code
### `components/academics/assessment/SubjectSelectionPage.astro`

- `CAREER` — a route constant — navigation, stays in code
- `SENIOR` — a route constant — navigation, stays in code
- `UNIVERSITY` — a route constant — navigation, stays in code
### `components/academics/assessment/SuccessStoriesPage.astro`

- `ACHIEVEMENTS` — a route constant — navigation, stays in code
- `CONTACT` — a route constant — navigation, stays in code
### `components/academics/assessment/UniversityCounsellingPage.astro`

- `CAREER` — a route constant — navigation, stays in code
- `SUBJECT` — a route constant — navigation, stays in code
### `components/academics/parents/Comms.astro`

- `clouds` — animation table {class, w, dur, delay}
### `components/academics/partnership/ParentsForumPage.astro`

- `ENGAGE` — a route constant — navigation, stays in code
### `components/academics/partnership/PpCta.astro`

- `CONTACT` — a route constant — navigation, stays in code
### `components/academics/structure/MiddleSchoolPage.astro`

- `CAREERS` — a route constant — navigation, stays in code
- `MARK` — a glyph or geometry table
- `STEM` — a route constant — navigation, stays in code
- `SUCCESS` — a route constant — navigation, stays in code
### `components/academics/structure/PrePrimaryPage.astro`

- `ACTIVITIES` — a route constant — navigation, stays in code
- `FACILITIES` — a route constant — navigation, stays in code
- `MARK` — a glyph or geometry table
### `components/academics/structure/PrimaryPage.astro`

- `FACILITIES` — a route constant — navigation, stays in code
- `MARK` — a glyph or geometry table
- `SUCCESS` — a route constant — navigation, stays in code
### `components/academics/structure/SecondaryPage.astro`

- `CURRICULUM` — a route constant — navigation, stays in code
- `FACILITIES` — a route constant — navigation, stays in code
- `MARK` — a glyph or geometry table
### `components/academics/structure/SeniorSecondaryPage.astro`

- `CURRICULUM` — a route constant — navigation, stays in code
- `FACILITIES` — a route constant — navigation, stays in code
- `LABS` — a route constant — navigation, stays in code
- `MARK` — a glyph or geometry table
### `components/academics/structure/StreamsOfferedPage.astro`

- `COMBINATIONS` — a route constant — navigation, stays in code
- `MARK` — a glyph or geometry table
### `components/academics/structure/SubjectCombinationsPage.astro`

- `CONTACT` — a route constant — navigation, stays in code
- `MARK` — a glyph or geometry table
### `components/academics/teaching/ExperientialLearningPage.astro`

- `MARK` — a glyph or geometry table
### `components/academics/teaching/LaboratoriesClubsPage.astro`

- `MARK` — a glyph or geometry table
- `READING` — a route constant — navigation, stays in code
- `STEM` — a route constant — navigation, stays in code
### `components/academics/teaching/MethodologyPage.astro`

- `MARK` — a glyph or geometry table
- `SMART` — a route constant — navigation, stays in code
### `components/academics/teaching/ReadingLanguagePage.astro`

- `MARK` — a glyph or geometry table
### `components/academics/teaching/SmartClassroomsPage.astro`

- `MARK` — a glyph or geometry table
- `STEM` — a route constant — navigation, stays in code
### `components/academics/teaching/StemRoboticsPage.astro`

- `MARK` — a glyph or geometry table
- `SUCCESS` — a route constant — navigation, stays in code
### `components/academics/TeachingPhilosophy.astro`

- `icons` — a glyph or geometry table

